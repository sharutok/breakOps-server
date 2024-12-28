exports.breakdown_machines_query = (start_date, end_date, list) => {
    try {
        console.log({ start_date, end_date, list });
        
        let _list = list.map(value => `'${value}'`).join(", ");
    _list=[...list,0]
            const q = `
            select * from (
            SELECT
            voae.*,
            voeb.status,voeb.creation_date
        FROM
            view_of_all_equipment voae
        LEFT JOIN
            view_of_equipment_breakdown voeb
            ON voae.equipment_id = voeb.equipment_id
            where voeb.creation_date is not null
                AND voeb.creation_date >= '${start_date} 00:00:00'
                AND voeb.creation_date <= '${end_date} 23:59:59'
        ) t1 where equipment_id not in (${_list}) order by t1.department_id,t1.section,t1.equipment
    `
        return q
    } catch (error) {
        console.log("error in breakdown_machines_query");
        
    }
}


exports.list_of_section_id = () => {
    try {
        const q = `
        select * from view_of_all_equipment voae
        `
        return  q
    } catch (error) {
        console.log("error in list_of_section_id");
        
    }
}