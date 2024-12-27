const { AutomigData, ListOfIgnoredSectionId, getIgnoredEquipmentId, setIgnoredEquipmentId, } = require('../Controller/Automig')

const router = require('express').Router()

router.post('/dashboard', AutomigData)
router.get('/list-of-section-id', ListOfIgnoredSectionId)
router.get('/list-of-rejected-equipment-id', getIgnoredEquipmentId)
router.post('/list-of-rejected-equipment-id', setIgnoredEquipmentId)


module.exports=router