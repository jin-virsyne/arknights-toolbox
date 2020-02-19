import json

# Have to change the paths to what you use. I will assume here China has all of them for now. If it changes, F.

def load_json(path: str):
    file_handle = open(path, 'r', encoding='utf8')
    json_object = json.load(file_handle)
    file_handle.close()

    return json_object

def save_json(name: str, data: dict):
    file_handle = open(name, 'w+', encoding='utf8')
    json.dump(data, file_handle, indent=4, ensure_ascii=False)
    file_handle.close()

def parse_operators():
    operator_table = {}

    cn_operators = load_json('AKTools/game_data/zh-CN/gamedata/excel/character_table.json')
    en_operators = load_json('AKTools/game_data/en-US/gamedata/excel/character_table.json')
    cn_skills = load_json('AKTools/game_data/zh-CN/gamedata/excel/skill_table.json')
    en_skills = load_json('AKTools/game_data/en-US/gamedata/excel/skill_table.json')

    for id, data in cn_operators.items():
        # Let's ignore traps and such.
        if not id.startswith('char_'):
            continue

        en_data = en_operators.get(id, None)

        # If it's not in English we can use the appellation name in the character_table.json from China client.
        name = en_data and en_data['name'] or data['appellation']

        operator_table[name] = {
            'name': name,
            'rarity': data['rarity'],
            'profession': data['profession'].title(),
            'evolveCosts': [phase['evolveCost'] for phase in data['phases']],
            'sskillCosts': [],
            'askillCosts': data['allSkillLvlup']
        }

        for skill in data['skills']:
            en_skill_data = en_skills.get(skill['skillId'], None)

            skill_name = en_skill_data and en_skill_data['levels'][0]['name'] or cn_skills[skill['skillId']]['levels'][0]['name']

            skill_cost = {'skillName': skill_name, 'levelUpCost': skill['levelUpCostCond'], 'unlockCond': skill['unlockCond']}

            operator_table[name]['sskillCosts'].append(skill_cost)

    return operator_table

def parse_items():
    items_table = {}

    cn_items = load_json('AKTools/game_data/zh-CN/gamedata/excel/item_table.json')
    en_items = load_json('AKTools/game_data/en-US/gamedata/excel/item_table.json')

    cn_stages = load_json('AKTools/game_data/zh-CN/gamedata/excel/stage_table.json')
    en_stages = load_json('AKTools/game_data/en-US/gamedata/excel/stage_table.json')

    cn_building_data = load_json('AKTools/game_data/zh-CN/gamedata/excel/building_data.json')

    for id, data in cn_items['items'].items():
        if id.startswith('p_') or id.startswith('tier'):
            continue
        if data['classifyType'] != 'MATERIAL':
            continue
    
        if data['itemType'] != 'MATERIAL':
            continue

        en_data = en_items['items'].get(id, None)

        name = en_data and en_data['name'] or data['name']

        items_table[id] = {
            'id': id,
            'name': name,
            'cn_name': data['name'],
            'rarity': data['rarity'] + 1,
            'source': {},
            'madeof': {},
            'icon': data['iconId'],
            'sort': data['sortId']

        }

        for stage in data['stageDropList']:
            cn_stage_data = cn_stages['stages'][stage['stageId']]

            if cn_stage_data['stageType'] != 'MAIN':
                continue

            en_stage_data = en_stages['stages'].get(stage['stageId'], None)

            stage_name = en_stage_data and en_stage_data['code'] or cn_stage_data['code']
            
            items_table[id]['source'][stage_name] = stage['occPer']
        
        if id in ('3211', '3212', '3221', '3222', '3231', '3232', '3241', '3242', '3251', '3252', '3261', '3262', '3271', '3272', '3281', '3282'):
            continue
        
        for building_formula in data['buildingProductList']:
            if building_formula['roomType'] == 'MANUFACTURE':
                formula_list = 'manufactFormulas'
            elif building_formula['roomType'] == 'WORKSHOP':
                formula_list = 'workshopFormulas'
            else:
                print(building_formula['roomType'])


            for cost in cn_building_data[formula_list][building_formula['formulaId']]['costs']:
                en_item_data = en_items['items'].get(cost['id'], None)

                item_name = en_item_data and en_item_data['name'] or cn_items['items'][cost['id']]['name']
                items_table[id]['madeof'][item_name] = cost['count']

    return items_table


def main():
    operators = parse_operators()
    save_json('operators.json', operators)

    items = parse_items()
    save_json('items.json', items)

if __name__ == '__main__':
    main()