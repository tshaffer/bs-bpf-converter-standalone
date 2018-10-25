const ora = require('ora');
const redux = require('redux');
const fs = require('fs');
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;
const compose = redux.compose;
const createStore = redux.createStore;
const thunk = require('redux-thunk').default;
const bsCore = require('@brightsign/bscore');
const AssetType = bsCore.AssetType;
const AssetLocation = bsCore.AssetLocation;
const bscStripFileExtension = bsCore.bscStripFileExtension;
const bscAssetLocatorForLocalAsset = bsCore.bscAssetLocatorForLocalAsset;
const bsDm = require('@brightsign/bsdatamodel');
const bsDmReducer = bsDm.bsDmReducer;
// const baPresentationEditUi = require('@brightsign/ba-presentation-edit-ui');
// const bapeuiReducer = baPresentationEditUi.baPeUiModelReducer;

const bsContentManager = require('@brightsign/bs-content-manager');
const cmGetBsAsset = bsContentManager.cmGetBsAsset;
const cmGetBsAssetCollection = bsContentManager.cmGetBsAssetCollection;

const bpfConverter = require('../dist/bs-bpf-converter');
const bsBpfCConvertPresentation = bpfConverter.bsBpfCConvertPresentation;

const fsConnector = require('@brightsign/fsconnector');
const fsGetAssetItemFromFile = fsConnector.fsGetAssetItemFromFile;
const fsSaveObjectAsLocalJsonFile = fsConnector.fsSaveObjectAsLocalJsonFile;
const fsGetLocalFileAsArrayBuffer = fsConnector.fsGetLocalFileAsArrayBuffer;
const fsGetLocalSystemScopeId = fsConnector.fsGetLocalSystemScopeId;

const spinner = ora({
  spinner: {
    interval: 80,
    frames: [' 🥓🥓 ', '  🥓🥓', ' 🥓🥓 ', '🥓🥓  ']
  }
});
const middleware = [thunk];
const store = createStore(
  combineReducers({
    bsdm: bsDmReducer,
    // bapeui: bapeuiReducer,
  }),
  {},
  compose(applyMiddleware(...middleware))
);

function readFileAsBuffer(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
}

function convertBpfFile(assetItem) {
  const bsAsset = cmGetBsAsset(assetItem);
  const assetPath = bsAsset.fullPath;
  const nextAssetPath = bscStripFileExtension(assetPath) + '.bpfx';
  spinner.start(' converting: ' + assetPath);
  return fsGetLocalFileAsArrayBuffer(assetPath)
    .then(function (buffer) {
      return store.dispatch(bsBpfCConvertPresentation(Buffer.from(buffer)));
    })
    .then(function (bsdmState) {
      return fsSaveObjectAsLocalJsonFile(bsdmState, nextAssetPath);
    })
    // .then(function () {
    //   return resolveLinks(nextAssetPath);
    // })
    .then(function () {
      return Promise.resolve(1);
    });
}

function convertDirectory(assetItem) {
  const assetItems = [];
  let index = 0;
  let processed = 0;
  const bsAsset = cmGetBsAsset(assetItem);
  const assetPath = bsAsset.fullPath;
  const collection = cmGetBsAssetCollection(AssetLocation.Local, AssetType.ProjectBpf, assetPath, { includeLegacyAssets: true });

  const convertNext = function () {
    if (index < assetItems.length) {
      return convertBpfFile(assetItems[index])
        .then(() => {
          index += 1;
          return convertNext();
        });
    } else {
      return Promise.resolve();
    }
  };
  return collection.update()
    .then(function (assetList) {
      for (let i = 0; i < assetList.length; i++) {
        const asset = collection.getAsset(assetList[i]);
        if (asset !== null && asset.assetType === AssetType.ProjectBpf) {
          assetItems.push(asset.assetItem);
        }
      }
      return Promise.resolve();
    })
    .then(function () {
      processed += 1;
      return convertNext();
    })
    .then(function () {
      return Promise.resolve(index);
    });
}

module.exports = function (args) {
  spinner.start();
  let promise = null;
  const source = args.source || args.s;
  const assetItem = fsGetAssetItemFromFile(source);
  if (assetItem === null) {
    promise = Promise.reject('invalid argument source');
  } else if (assetItem.assetType === AssetType.Folder) {
    promise = convertDirectory(assetItem, args);
  } else if (assetItem.assetType === AssetType.ProjectBpf) {
    promise = convertBpfFile(assetItem, args);
  } else {
    promise = Promise.reject('unable to find bpf project file at source');
  }

  return promise
    .then(function (count) {
      spinner.stop();
      console.log(count + ' project files converted');
    })
    .catch(function (err) {
      spinner.stop();
      console.error(err);
    });
};
