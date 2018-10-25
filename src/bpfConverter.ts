import isomorphicPath from 'isomorphic-path';
import thunkMiddleware from 'redux-thunk';

import { cloneDeep } from 'lodash';
import { isObject } from 'lodash';
import { isNil } from 'lodash';

import { AssetLocation, AssetType } from '@brightsign/bscore';
import { BsAssetCollection, cmGetBsAssetCollection } from '@brightsign/bs-content-manager';
import {
  dmOpenSign,
  DmState,
} from '@brightsign/bsdatamodel';
import { 
  BaPeUiInteractiveCanvasEvent,
  BaPeUiInteractiveCanvasState,
  BaPeUiModelInteractiveCanvasState,
  BaPeUiInteractiveCanvasEventMap,
  BaPeUiInteractiveCanvasStateMap,
  BaPeUiInteractiveCanvasViewTransformMap,
  BaProjectFileState,
 } from '@brightsign/bacon-core';

import {
  bpfToJson,
} from './bpfToJson';

import {
  isXml
} from './helpers';

import { generateStateFromBpf } from './bpfToDmStateConverter';

export function bsBpfCConvertPresentation(buffer: Buffer) : Function {

  return (dispatch : Function, getState : Function) : Promise<void> => {

    return new Promise((resolve, reject) => {

      // determine whether data in buffer represents bpf
      isXml(buffer).then( (bufferIsXml : boolean) => {

        if (bufferIsXml) {

          // buffer contains xml. assume it's a BA classic presentation.
          // TODO - further verification / validation required.

          // if bpf xml, convert to json
          bpfToJson(buffer).then( (bpf : any) => {

            // convert bpf json to dmState.
            dispatch(generateStateFromBpf(bpf)).then( (state: any) => {
              const bpfxState : any = createProjectFileStateFromState(state);
              resolve(bpfxState);
            });
          });
        }
      });
    });
  };
}

// TODO - placeholder
export const getBpfxState = (state : any) : any => {
  return null;
};

function getLocalContentCollection(path: string): BsAssetCollection {
  return cmGetBsAssetCollection(AssetLocation.Local, [
      AssetType.Content,
      AssetType.Project,
      AssetType.ProjectBpf,
      AssetType.BrightScript,
      AssetType.HtmlSite,
      AssetType.Font,
      AssetType.Folder
    ],
    path, {folders: false});
}

const createProjectFileState = (bsDmState: DmState): Object => {
  if (!isObject(bsDmState)){
    throw 'TODO error'; // TODO implement error;
  }
  return {
    bsdm: bsDmState
  };
};

// TODO - rework once non bsdm properties are added to bpfxState
const createProjectFileStateFromState = (state: any): Object => {

  // const bsDmState: DmState = state.bsdm;
  if (!isObject(state.bsdm)){
    debugger;
  }
  // if (!isObject(state.bapeui)){
  //   debugger;
  // }

  // let interactiveCanvasState: BaPeUiModelInteractiveCanvasState;
  // interactiveCanvasState.statePositionById = {};
  // interactiveCanvasState.eventDataById = {};
  // interactiveCanvasState.viewTransformByZoneId = {};

  // let baProjectFileState: BaProjectFileState;
  // baProjectFileState.bsdm = state.bsdm;
  // baProjectFileState.interactive = interactiveCanvasState;
  const baProjectFileState: BaProjectFileState = {
    bsdm: state.bsdm,
    interactive: interactiveCanvasState
  };

  return baProjectFileState;
};

const interactiveCanvasState: BaPeUiModelInteractiveCanvasState = {
  statePositionById: {},
  eventDataById: {},
  viewTransformByZoneId: {},
};

export function baPeUiModelAddInteractiveCanvasState(interactiveState: BaPeUiInteractiveCanvasState) {
  interactiveCanvasState.statePositionById[interactiveState.id] = interactiveState;
}

export function baPeUiModelAddInteractiveCanvasEvent(interactiveEvent: BaPeUiInteractiveCanvasEvent) {
  interactiveCanvasState.eventDataById[interactiveEvent.id] = interactiveEvent;
}


