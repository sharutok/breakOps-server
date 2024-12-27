const moment = require("moment");
const { mysqlConnect } = require("../DbConnections/mysqlconfig");
const { redisConnect } = require("../DbConnections/redisconfig");
const { breakdown_machines_query, list_of_section_id } = require("../sql_queries/mysql");

exports.AutomigData = async(req, res) => {
    try {
        // get cached data from redis
        const r = await redisConnect()
        const r_dashboard_output =await r.get("dashboard_output")
        if (r_dashboard_output) {
            console.log("cached_output");
            return res.status(200).json(JSON.parse(r_dashboard_output))
        }
        

        const auto_mig = []
        const electrode = []

        const start_date=moment(req.body.start_date).format("YYYY-MM-DD")
        const end_date = moment(req.body.end_date).format("YYYY-MM-DD")
        
        const list = JSON.parse(await r.get("ignored_equipment_id"))

        const data = await mysqlConnect(breakdown_machines_query(start_date,end_date,list))
        console.log(data?.[0]?.length, start_date,end_date);
        
        data?.[0]?.map(x => {
            switch (x['department_id']) {
                case 1:
                    electrode.push(x)
                    break;
                case 2:
                    auto_mig.push(x)
                    break;
            }
        })
        
        const auto_mig_section = new Set();
        const electrode_section = new Set();
        
        auto_mig.map(x => {
            auto_mig_section.add(x.section);
            
        })
        
        electrode.map(x => {
            electrode_section.add(x.section);    
        })

        let final_automig = []
        
        auto_mig.map(y => {  
            auto_mig_section.forEach(x => {
                if (y["section"] == x) {
                    final_automig.push({  [x]:y })
                }
            })
        })
       
        let final_electrode = []
        
        electrode.map(y => {  
            electrode_section.forEach(x => {
                if (y["section"] == x) {
                    final_electrode.push({  [x]:y })
                }
            })
        })

        const groupDataBySection = (data) => {
            return data.reduce((acc, item) => {
                const sectionName = Object.keys(item)[0];
                const equipmentData = item[sectionName]; 
                if (!acc[sectionName]) {
                    acc[sectionName] = [];
                }
                acc[sectionName].push(equipmentData);
                return acc;
            }, {});
        };
        console.log("generated_output");
        const output ={ auto_mig: groupDataBySection(final_automig), electrode: groupDataBySection(final_electrode)}

        save_dashboard_output_data_to_redis(output)

        return res.status(200).json(output)
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:JSON.stringify(error)})        
    }
}

exports.ListOfIgnoredSectionId = async (req, res) => {
    try {
        const r = await redisConnect()
        const r_list_of_all_equipment = await r.get("list_of_all_equipment")
        if (r_list_of_all_equipment) {
            console.log("cached_output r_list_of_all_equipment");
            return res.status(200).json(JSON.parse(r_list_of_all_equipment))
        }
        
        const data = await mysqlConnect(list_of_section_id())
        let equipment_data = []
        data[0]?.map(x => {
            equipment_data.push({equipment_id:x.equipment_id})
        })

        console.log("generated_output r_list_of_all_equipment");

        save_all_equipment_id_to_redis(equipment_data)

        res.status(200).json(equipment_data)
        
    } catch (error) {
        console.log("error in ListOfIgnoredSectionId",error);
    }
}

exports.getIgnoredEquipmentId = async (req, res) => {
    try {
        const _res = await ((await redisConnect()).get("ignored_equipment_id"))
        res.status(200).json(JSON.parse(_res))
    } catch (error) {
        console.log("getIgnoredEquipmentId",error);
        
    }
}
exports.setIgnoredEquipmentId = async (req, res) => {
    try {
        const equipment_id = req?.body?.equipmentList
        
        await (await redisConnect()).del("dashboard_output")
        
        const _res = await ((await redisConnect()).set("ignored_equipment_id", JSON.stringify(equipment_id)))
        res.status(200).json(_res)
    } catch (error) {
        res.status(400)
        console.log("setIgnoredEquipmentId",error);
        
    }
}


async function save_dashboard_output_data_to_redis(data) {
    const rconnection = await redisConnect()
    rconnection.set("dashboard_output", JSON.stringify(data) , {
        EX: 60 * 60 * 0.25 
    })
}

async function save_all_equipment_id_to_redis(data) {
    const rconnection = await redisConnect()
    rconnection.set("list_of_all_equipment", JSON.stringify(data) , {
        EX: 60 * 60 * 24
    })
    
}




