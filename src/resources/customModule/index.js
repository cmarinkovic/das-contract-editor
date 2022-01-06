import CustomPaletteProvider from "./CustomPaletteProvider";
import CustomReplaceMenuProvider from "./CustomReplaceMenuProvider";
import DasContractPropertiesProvider from "./customPropertiesPanel/dascontract/DasContractPropertiesProvider";

/**
 * Customized process editor for ProcessEditor.
 */
const customModule = {
  __init__: ["paletteProvider", "replaceMenuProvider", "propertiesProvider"],
  paletteProvider: ["type", CustomPaletteProvider],
  replaceMenuProvider: ["type", CustomReplaceMenuProvider],
  propertiesProvider: ["type", DasContractPropertiesProvider],
};

export default customModule;
