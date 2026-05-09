declare module 'react-cytoscapejs' {
  import { Component } from 'react';
  import { Core, StylesheetCSS, LayoutOptions } from 'cytoscape';

  interface CytoscapeComponentProps {
    id?: string;
    cy?: (cy: Core) => void;
    elements: any[];
    style?: React.CSSProperties;
    layout?: LayoutOptions;
    stylesheet?: StylesheetCSS | StylesheetCSS[];
    className?: string;
    minZoom?: number;
    maxZoom?: number;
    wheelSensitivity?: number;
    boxSelectionEnabled?: boolean;
    autoungrabify?: boolean;
    autounselectify?: boolean;
    panningEnabled?: boolean;
    userPanningEnabled?: boolean;
    zoomingEnabled?: boolean;
    userZoomingEnabled?: boolean;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
