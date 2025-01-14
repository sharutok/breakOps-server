const { AutomigData, ListOfIgnoredSectionId, getIgnoredEquipmentId, setIgnoredEquipmentId, AutomigCachedData, AutomigFetchedData, } = require('../Controller/Automig')

const router = require('express').Router()

router.post('/dashboard', AutomigCachedData)
router.post('/generate-dashboard', AutomigFetchedData)
router.get('/list-of-section-id', ListOfIgnoredSectionId)
router.get('/list-of-rejected-equipment-id', getIgnoredEquipmentId)
router.post('/list-of-rejected-equipment-id', setIgnoredEquipmentId)


module.exports = router



