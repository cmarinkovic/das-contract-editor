import CustomViewerPaletteProvider from './CustomViewerPaletteProvider';
import CustomViewerReplaceMenuProvider from "./CustomViewerReplaceMenuProvider";
import CustomViewerContexPadProvider from "./CustomViewerContextPadProvider";
import DasContractPropertiesProvider from "./customViewerPropertiesPanel/dascontract/DasContractPropertiesProvider";


const CustomViewerModule = {
    __init__: ['paletteProvider', 'replaceMenuProvider', 'contextPadProvider', 'propertiesProvider'],
    paletteProvider: ['type', CustomViewerPaletteProvider],
    replaceMenuProvider: ['type', CustomViewerReplaceMenuProvider],
    contextPadProvider: ['type', CustomViewerContexPadProvider],
    propertiesProvider: ['type', DasContractPropertiesProvider]
};

export default CustomViewerModule;
