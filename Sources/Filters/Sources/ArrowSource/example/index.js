import 'vtk.js/Sources/favicon';

import vtkActor                   from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkArrowSource             from 'vtk.js/Sources/Filters/Sources/ArrowSource';
import vtkFullScreenRenderWindow  from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper                  from 'vtk.js/Sources/Rendering/Core/Mapper';

import controlPanel from './controlPanel.html';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({ background: [0, 0, 0] });
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

function createArrowPipeline() {
  const arrowSource = vtkArrowSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  actor.getProperty().setEdgeVisibility(true);
  actor.getProperty().setEdgeColor(1, 0, 0);
  actor.getProperty().setRepresentationToSurface();
  mapper.setInputConnection(arrowSource.getOutputPort());

  renderer.addActor(actor);
  return { arrowSource, mapper, actor };
}

const pipelines = [createArrowPipeline()];

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

['tipResolution', 'tipRadius', 'tipLength', 'shaftResolution', 'shaftRadius'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value = Number(e.target.value);
    pipelines[0].arrowSource.set({ [propertyName]: value });
    renderWindow.render();
  });
});

document.querySelector('.invert').addEventListener('change', (e) => {
  const invert = !!(e.target.checked);
  pipelines[0].arrowSource.set({ invert });
  renderWindow.render();
});

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;
