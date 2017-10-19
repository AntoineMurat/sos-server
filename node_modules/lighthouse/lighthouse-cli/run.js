/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Printer = require("./printer");
const chrome_launcher_1 = require("chrome-launcher");
const yargsParser = require('yargs-parser');
const lighthouse = require('../lighthouse-core');
const log = require('lighthouse-logger');
const getFilenamePrefix = require('../lighthouse-core/lib/file-namer.js').getFilenamePrefix;
const assetSaver = require('../lighthouse-core/lib/asset-saver.js');
// accept noop modules for these, so the real dependency is optional.
const shim_modules_1 = require("./shim-modules");
const _RUNTIME_ERROR_CODE = 1;
const _PROTOCOL_TIMEOUT_EXIT_CODE = 67;
// exported for testing
function parseChromeFlags(flags = '') {
    const parsed = yargsParser(flags, { configuration: { 'camel-case-expansion': false, 'boolean-negation': false } });
    return Object
        .keys(parsed)
        .filter(key => key !== '_')
        .map(key => {
        if (parsed[key] === true)
            return `--${key}`;
        return `--${key}="${parsed[key]}"`;
    });
}
exports.parseChromeFlags = parseChromeFlags;
/**
 * Attempts to connect to an instance of Chrome with an open remote-debugging
 * port. If none is found, launches a debuggable instance.
 */
function getDebuggableChrome(flags) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chrome_launcher_1.launch({
            port: flags.port,
            chromeFlags: parseChromeFlags(flags.chromeFlags),
            logLevel: flags.logLevel
        });
    });
}
function showConnectionError() {
    console.error('Unable to connect to Chrome');
    process.exit(_RUNTIME_ERROR_CODE);
}
function showRuntimeError(err) {
    console.error('Runtime error encountered:', err);
    if (err.stack) {
        console.error(err.stack);
    }
    process.exit(_RUNTIME_ERROR_CODE);
}
function showProtocolTimeoutError() {
    console.error('Debugger protocol timed out while connecting to Chrome.');
    process.exit(_PROTOCOL_TIMEOUT_EXIT_CODE);
}
function showPageLoadError() {
    console.error('Unable to load the page. Please verify the url you are trying to review.');
    process.exit(_RUNTIME_ERROR_CODE);
}
function handleError(err) {
    if (err.code === 'PAGE_LOAD_ERROR') {
        showPageLoadError();
    }
    else if (err.code === 'ECONNREFUSED') {
        showConnectionError();
    }
    else if (err.code === 'CRI_TIMEOUT') {
        showProtocolTimeoutError();
    }
    else {
        showRuntimeError(err);
    }
}
function saveResults(results, artifacts, flags) {
    let promise = Promise.resolve(results);
    const cwd = process.cwd();
    // Use the output path as the prefix for all generated files.
    // If no output path is set, generate a file prefix using the URL and date.
    const configuredPath = !flags.outputPath || flags.outputPath === 'stdout' ?
        getFilenamePrefix(results) :
        flags.outputPath.replace(/\.\w{2,4}$/, '');
    const resolvedPath = path.resolve(cwd, configuredPath);
    if (flags.saveArtifacts) {
        assetSaver.saveArtifacts(artifacts, resolvedPath);
    }
    if (flags.saveAssets) {
        promise = promise.then(_ => assetSaver.saveAssets(artifacts, results.audits, resolvedPath));
    }
    const typeToExtension = (type) => type === 'domhtml' ? 'html' : type;
    return promise.then(_ => {
        if (Array.isArray(flags.output)) {
            return flags.output.reduce((innerPromise, outputType) => {
                const outputPath = `${resolvedPath}.report.${typeToExtension(outputType)}`;
                return innerPromise.then((_) => Printer.write(results, outputType, outputPath));
            }, Promise.resolve(results));
        }
        else {
            const outputPath = flags.outputPath || `${resolvedPath}.report.${typeToExtension(flags.output)}`;
            return Printer.write(results, flags.output, outputPath).then(results => {
                if (flags.output === Printer.OutputMode[Printer.OutputMode.html] ||
                    flags.output === Printer.OutputMode[Printer.OutputMode.domhtml]) {
                    if (flags.view) {
                        shim_modules_1.opn(outputPath, { wait: false });
                    }
                    else {
                        log.log('CLI', 'Protip: Run lighthouse with `--view` to immediately open the HTML report in your browser');
                    }
                }
                return results;
            });
        }
    });
}
exports.saveResults = saveResults;
function runLighthouse(url, flags, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let launchedChrome;
        try {
            launchedChrome = yield getDebuggableChrome(flags);
            flags.port = launchedChrome.port;
            const results = yield lighthouse(url, flags, config);
            const artifacts = results.artifacts;
            delete results.artifacts;
            yield saveResults(results, artifacts, flags);
            yield launchedChrome.kill();
            return results;
        }
        catch (err) {
            if (typeof launchedChrome !== 'undefined') {
                yield launchedChrome.kill();
            }
            return handleError(err);
        }
    });
}
exports.runLighthouse = runLighthouse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYiw2QkFBNkI7QUFFN0IscUNBQXFDO0FBR3JDLHFEQUF1RDtBQUV2RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDakQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekMsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztBQUM1RixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUVwRSxxRUFBcUU7QUFDckUsaURBQW1DO0FBRW5DLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLE1BQU0sMkJBQTJCLEdBQUcsRUFBRSxDQUFDO0FBTXZDLHVCQUF1QjtBQUN2QiwwQkFBaUMsUUFBZ0IsRUFBRTtJQUNqRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQ3RCLEtBQUssRUFBRSxFQUFDLGFBQWEsRUFBRSxFQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFFeEYsTUFBTSxDQUFDLE1BQU07U0FDUixJQUFJLENBQUMsTUFBTSxDQUFDO1NBRVosTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDO1NBRTFCLEdBQUcsQ0FBQyxHQUFHO1FBQ04sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxN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