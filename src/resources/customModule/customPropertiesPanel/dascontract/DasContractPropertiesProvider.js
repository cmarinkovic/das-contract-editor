var inherits = require("inherits"),
  is = require("bpmn-js/lib/util/ModelUtil").is;

var PropertiesActivator = require("bpmn-js-properties-panel/lib/PropertiesActivator");

var processProps = require("./parts/ProcessProps"),
  eventProps = require("./parts/EventProps"),
  linkProps = require("./parts/LinkProps"),
  documentationProps = require("./parts/DocumentationProps"),
  idProps = require("./parts/IdProps"),
  nameProps = require("./parts/NameProps"),
  executableProps = require("./parts/ExecutableProps");
const DasContractProps = require("./parts/DasContractProps");

function getIdOptions(element) {
  if (is(element, "bpmn:Participant")) {
    return { id: "participant-id", label: "Participant Id" };
  }
}

function getNameOptions(element) {
  if (is(element, "bpmn:Participant")) {
    return { id: "participant-name", label: "Participant Name" };
  }
}

function createGeneralTabGroups(
  element,
  canvas,
  bpmnFactory,
  elementRegistry,
  translate
) {
  var generalGroup = {
    id: "general",
    label: translate("General"),
    entries: [],
  };
  idProps(generalGroup, element, translate, getIdOptions(element));
  nameProps(
    generalGroup,
    element,
    bpmnFactory,
    canvas,
    translate,
    getNameOptions(element)
  );
  processProps(generalGroup, element, translate);
  executableProps(generalGroup, element, translate);

  var detailsGroup = {
    id: "details",
    label: translate("Details"),
    entries: [],
  };
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: "documentation",
    label: translate("Documentation"),
    entries: [],
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  /**
   * DasContract props group.
   */
  var dasContractGroup = {
    id: "das-contract",
    label: "DasContract",
    entries: [],
  };

  /**
   * Adds DasContract props to properties panel.
   */
  DasContractProps(dasContractGroup, element, translate);

  return [generalGroup, detailsGroup, dasContractGroup, documentationGroup];
}

function DasContractPropertiesProvider(
  eventBus,
  canvas,
  bpmnFactory,
  elementRegistry,
  translate
) {
  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {
    var generalTab = {
      id: "general",
      label: translate("General"),
      groups: createGeneralTabGroups(
        element,
        canvas,
        bpmnFactory,
        elementRegistry,
        translate
      ),
    };

    return [generalTab];
  };
}

DasContractPropertiesProvider.$inject = [
  "eventBus",
  "canvas",
  "bpmnFactory",
  "elementRegistry",
  "translate",
];

inherits(DasContractPropertiesProvider, PropertiesActivator);

module.exports = DasContractPropertiesProvider;
