var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    ModelUtil = require('bpmn-js/lib/util/ModelUtil'),
    is = ModelUtil.is,
    participantHelper = require('bpmn-js-properties-panel/lib/helper/ParticipantHelper');

module.exports = function (group, element, translate, options) {
    if (is(element, 'bpmn:Activity')) {
        group.entries.push(entryFactory.textBox(translate, {
            id: 'activity-properties',
            label: 'Activity properties',
            modelProperty: 'activity-properties',
        }));
    }

    if (is(element, 'bpmn:Process')) {
        group.entries.push(entryFactory.textBox(translate, {
            id: 'data-model',
            label: 'Data model',
            modelProperty: 'data-model',
        }));
    }

    if (is(element, 'bpmn:Participant')) {

        /*
         * Das Contract Data model
         */
        var dataModelEntry = entryFactory.textBox(translate, {
            id: 'process-data-model',
            label: translate('Data model'),
            modelProperty: 'dascontract:data-model',
        });

        // In participants we have to change the default behavior of set and get
        dataModelEntry.get = function (element) {
            var properties = participantHelper.getProcessBusinessObject(element, 'dascontract:data-model');
            return {"dascontract:data-model": properties["dascontract:data-model"]};
        };

        dataModelEntry.set = function (element, values) {
            return participantHelper.modifyProcessBusinessObject(element, 'dascontract:data-model', {"dascontract:data-model": values["dascontract:data-model"]});
        };

        group.entries.push(dataModelEntry);
    }
};
