(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tsserver = {}));
})(this, (function (exports) { 'use strict';

    // import * as acorn from 'acorn';
    // 不能使用 acorn,因为不能分析ts语法
    // 如果用js则不能使用断言，a.b.c!.push()
    // function validateExpression(code: string) {
    //   try {
    //     const expr = acorn.parseExpressionAt(code, 0, {
    //       ecmaVersion: 2015,
    //       locations: true,
    //     });
    //     if ((expr.end ?? 0) < code.length) {
    //       const remaining = code.slice(expr.end).trim();
    //       if (remaining.length > 0) {
    //         throw new Error('表达式后包含多余内容');
    //       }
    //     }
    //     return { valid: true };
    //   } catch (err: any) {
    //     return {
    //       valid: false,
    //       message: err.message,
    //       location: err.loc || { line: 1, column: 1 },
    //     };
    //   }
    // }
    // let curRuntime: 'expression' | 'script' = 'expression';
    function initEditor(monaco) {
        const div = document.createElement('div');
        div.style = 'width: 100%; height: 100%; ';
        document.body.appendChild(div);
        const editor = monaco.editor.create(div, {
            model: monaco.editor.getModel(monaco.Uri.parse('inmemory://baseflow/cur.ts')),
            theme: 'vs-dark',
            wordWrap: 'on',
            minimap: { enabled: false },
            contextmenu: false,
            accessibilitySupport: 'off',
            codeLens: false,
            quickSuggestions: false,
        });
        // editor.onDidChangeModelContent(() => {
        //   const code = editor.getValue();
        //   const model = editor.getModel()!;
        //   if (curRuntime === 'script') {
        //     monaco.editor.setModelMarkers(model, 'syntax', []);
        //     return;
        //   }
        //   const result = validateExpression(code);
        //   if (result.valid) {
        //     monaco.editor.setModelMarkers(model, 'syntax', []);
        //   } else {
        //     monaco.editor.setModelMarkers(model, 'syntax', [{
        //       startLineNumber: 1,
        //       startColumn: 1,
        //       endLineNumber: model.getLineCount(), // 结束行号（最后一行）
        //       endColumn: model.getLineLength(model.getLineCount()) + 1,
        //       message: `非法表达式：${result.message}`,
        //       severity: monaco.MarkerSeverity.Error,
        //     }]);
        //   }
        // });
        return editor;
    }

    class SyncStack {
        constructor(_cmdList) {
            this._cmdList = _cmdList;
            this._curCmd = {};
            this._cmdStack = {};
            this._uid = 0;
            this._timeout = 10000;
            Object.keys(_cmdList).forEach((cmd) => {
                this._cmdStack[cmd] = [];
            });
        }
        _addTask(_cmd, args, timeout = this._timeout) {
            return new Promise((onSuccess, onError) => {
                const cmd = _cmd;
                this._uid++;
                this._cmdStack[cmd].push({ uid: this._uid, cmd, args, onSuccess, onError, timeout });
                const curCmd = this._curCmd[cmd];
                if (!curCmd) {
                    this._nextCmd(cmd);
                }
            });
        }
        _nextCmd(cmd) {
            const item = this._cmdStack[cmd].shift();
            this._curCmd[cmd] = item;
            if (item) {
                const fun = this._cmdList[cmd];
                const callback = this._resultCmd.bind(this);
                setTimeout(() => {
                    const { cmd, args, uid, timeout } = item;
                    fun(uid, ...args);
                    item.timer = setTimeout(() => callback(uid, cmd, 'error', undefined), timeout);
                });
            }
        }
        _resultCmd(uid, _cmd, state, data) {
            const cmd = _cmd;
            const curItem = this._curCmd[cmd];
            if (curItem && curItem.uid === uid) {
                if (curItem.timer) {
                    clearTimeout(curItem.timer);
                }
                if (state === 'success') {
                    curItem.onSuccess(data);
                }
                else {
                    curItem.onError(data);
                }
                this._nextCmd(cmd);
            }
        }
    }
    function inJsTpl(lines, position) {
        const code = lines.join('\n').replace(/\\`/g, '\\"');
        const tpls = code.matchAll(/`[^`]*`/g);
        const tplRanges = [];
        for (const tpl of tpls) {
            console.log(tpl.input.slice(tpl.index, tpl.index + tpl[0].length));
            tplRanges.push([tpl.index, tpl.index + tpl[0].length]);
        }
        const cursorLines = lines.slice(0, position.lineNumber - 1);
        cursorLines.push(lines[position.lineNumber - 1].slice(0, position.column - 1));
        const cursorPoint = cursorLines.join('\n').length;
        for (const range of tplRanges) {
            if (range[0] < cursorPoint && range[1] > cursorPoint) {
                return true;
            }
        }
        return false;
    }
    const errorTpl = {
        // 'Conversion of type \'(\\w+)\' to type \'([^)]+)\' may be a mistake.*$': '$2类型不能接受$1类型',
        'Type (.+) is missing the following properties from type \'any\\[\\]\'.+$': 'Is not an array: $1',
        // Type 'http1' is missing the following properties from type 'any[]': length, pop, push, concat, and 16 more.
    };
    function replaceErrorMessage(err) {
        if (err) {
            for (const exp in errorTpl) {
                const reg = new RegExp(exp);
                if (reg.test(err)) {
                    return err.replace(reg, errorTpl[exp]);
                }
            }
        }
        return err;
    }
    function getErrorFlag(contents, lineNumber, message, flag) {
        let num = lineNumber - 1;
        const errorSource = contents[num];
        while (num > -1) {
            const str = contents[num];
            if (str.startsWith(flag)) {
                // console.error(message);
                const err = replaceErrorMessage(message).substring(0, 200);
                return { id: str.substring(flag.length), message: err || errorSource.substring(0, 200) };
            }
            num--;
        }
        return undefined;
    }

    const PathSplit = '𝍠';
    const ExpressionFlag = `//${PathSplit}Expression${PathSplit}=`;
    const style = document.createElement('style');
    style.textContent = `
  .monaco-hover .hover-row.status-bar {
    display: none !important;
  }
`;
    document.head.appendChild(style);
    const SystemFiles = {
        // 用来校验superInput表达式
        exp: { url: 'inmemory://baseflow/exp.ts', value: '', model: {} },
        // 用来为弹窗的代码提供上下文变量
        ctx: { url: 'inmemory://baseflow/ctx.ts', value: '', model: {} },
        // 用来校验当前表达式弹窗的代码
        cur: { url: 'inmemory://baseflow/cur.ts', value: '', model: {} },
        // 校验整个文档
        doc: { url: 'inmemory://baseflow/doc.ts', value: '', model: {} },
        // 定义系统内置变量及函数
        sys: { url: 'inmemory://baseflow/sys.d.ts', value: '', model: {} },
        // 用来校验superinput
        // 定义节点的输出类型
        typ: { url: 'inmemory://baseflow/typ.d.ts', value: '', model: {} },
        // 定义当前节点可用的变量，在当前节点之前的每个节点相当于一个变量
        var: { url: 'inmemory://baseflow/var.d.ts', value: '', model: {} },
        // 定义工具函数
        utl: { url: 'inmemory://baseflow/utl.d.ts', value: '', model: {} },
    };
    class MonacoEditor extends SyncStack {
        constructor(monaco, tsWorker, curEditor) {
            super({
                getType: (uid, expression) => {
                    return '';
                },
                checkDoc: (uid, dts, ts, flag) => {
                    this.setTypCode(dts);
                    this.setDocCode(ts);
                    this.getDiagnostics(uid, 'checkDoc', SystemFiles.doc, flag);
                },
                checkExp: (uid, ts) => {
                    this.setExpCode(ts);
                    this.getDiagnostics(uid, 'checkExp', SystemFiles.exp, ExpressionFlag);
                },
            });
            this.monaco = monaco;
            this.tsWorker = tsWorker;
            this.curEditor = curEditor;
            this.openLink = (resource) => {
                if (resource.scheme === 'file' && resource.path.startsWith('/@/')) {
                    // ?会被分割成query
                    const simplePath = [resource.path.substring(3), resource.query].filter(Boolean).join('?');
                    this.onLinkCallback?.(simplePath);
                }
                return true;
            };
            this.format = () => {
                const result = this.curEditor.getAction('editor.action.formatDocument')?.run();
                return result || Promise.resolve();
            };
            this.onLink = (callback) => {
                this.onLinkCallback = callback;
            };
            this.insertVariable = (text) => {
                const editor = this.curEditor;
                const selection = editor.getSelection();
                if (selection) {
                    const lines = editor.getModel().getLinesContent();
                    const isInTpl = inJsTpl(lines, selection.getStartPosition());
                    if (isInTpl) {
                        text = `\${${text}}`;
                    }
                    const op = { range: selection, text };
                    editor.executeEdits('', [op]);
                }
            };
            this.getType = (expression) => {
                return this._addTask('getType', [expression]);
            };
            this.checkDoc = (dts, ts, flag) => {
                return this._addTask('checkDoc', [dts, ts, flag]);
            };
            this.checkExp = (ts) => {
                return this._addTask('checkExp', [ts]);
            };
            monaco.editor.registerLinkOpener({ open: this.openLink });
        }
        getDiagnostics(uid, action, file, flag) {
            const tsWorker = this.tsWorker;
            Promise.all([tsWorker.getSyntacticDiagnostics(file.url), tsWorker.getSemanticDiagnostics(file.url)])
                .then(([syntacticResult, semanticResult]) => {
                const markers = [...syntacticResult, ...semanticResult];
                // console.log(action, '====');
                // console.log(markers);
                if (markers.length) {
                    const contents = file.model.getLinesContent() || [];
                    const errors = markers
                        .map((marker) => {
                        const { lineNumber = 1 } = file.model.getPositionAt(marker.start || 0);
                        return getErrorFlag(contents, lineNumber, typeof marker.messageText === 'string' ? marker.messageText : marker.messageText?.messageText || '', flag);
                    })
                        .reduce((obj, item) => {
                        if (item) {
                            obj[item.id] = item.message;
                        }
                        return obj;
                    }, {});
                    this._resultCmd(uid, action, 'success', errors);
                }
                else {
                    this._resultCmd(uid, action, 'success', {});
                }
            })
                .catch((e) => {
                this._resultCmd(uid, action, 'error', e);
            });
        }
        setSysCode(ts) {
            if (SystemFiles.sys.value !== ts) {
                SystemFiles.sys.value = ts;
                SystemFiles.sys.model.setValue(ts);
                console.log(`${SystemFiles.sys.url}\n`, ts);
                return true;
            }
            return false;
        }
        setUtlCode(ts) {
            if (SystemFiles.utl.value !== ts) {
                SystemFiles.utl.value = ts;
                SystemFiles.utl.model.setValue(ts);
                console.log(`${SystemFiles.utl.url}\n`, ts);
                return true;
            }
            return false;
        }
        setVarCode(ts) {
            if (SystemFiles.var.value !== ts) {
                SystemFiles.var.value = ts;
                SystemFiles.var.model.setValue(ts);
                console.log(`${SystemFiles.var.url}\n`, ts);
                return true;
            }
            return false;
        }
        setTypCode(ts) {
            if (SystemFiles.typ.value !== ts) {
                SystemFiles.typ.value = ts;
                SystemFiles.typ.model.setValue(ts);
                console.log(`${SystemFiles.typ.url}\n`, ts);
                return true;
            }
            return false;
        }
        setDocCode(ts) {
            if (SystemFiles.doc.value !== ts) {
                SystemFiles.doc.value = ts;
                SystemFiles.doc.model.setValue(`${ts}\nexport {};`);
                console.log(`${SystemFiles.doc.url}\n`, `${ts}\nexport {};`);
                return true;
            }
            return false;
        }
        setExpCode(ts) {
            if (SystemFiles.exp.value !== ts) {
                SystemFiles.exp.value = ts;
                SystemFiles.exp.model.setValue(`${ts}\nexport {};`);
                console.log(`${SystemFiles.exp.url}\n`, `${ts}\nexport {};`);
                return true;
            }
            return false;
        }
        setCurCode(ts, context = '', runtime = 'expression') {
            if (SystemFiles.ctx.value !== context) {
                SystemFiles.ctx.value = context;
                SystemFiles.ctx.model.setValue(context);
                console.log(`${SystemFiles.ctx.url}\n`, context);
            }
            // cur文件用户可自由修改而不更新systemFiles.cur.value，所以不能对比
            SystemFiles.cur.value = ts;
            SystemFiles.cur.model.setValue(ts);
            console.log(`${SystemFiles.cur.url}\n`, ts);
            return true;
        }
        getCurCode() {
            return SystemFiles.cur.model.getValue();
        }
    }
    async function createMonacoEditor(monaco) {
        const tsOptions = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
        tsOptions.lib = ['es5'];
        tsOptions.isolatedModules = true;
        tsOptions.checkJs = false;
        tsOptions.skipLibCheck = true;
        // tsOptions.noImplicitAny = false; 不能开启，否则用索引访问一个对象不存在的属性将不报错
        tsOptions.strict = true;
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(tsOptions);
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSuggestionDiagnostics: true,
        });
        monaco.languages.registerDefinitionProvider('typescript', {
            provideDefinition() {
                return [];
            },
        });
        // monaco.editor.onDidChangeMarkers((uris) => {
        //   uris.forEach((uri) => {
        //     const markers = monaco.editor.getModelMarkers({ resource: uri });
        //     // 过滤并修改标记信息
        //     const filteredMarkers = markers.map((marker) => {
        //     // 如果是 jQuery 类型定义建议的提示
        //       if (marker.message.includes('Do you need to install type definitions for jQuery?')) {
        //       // 只保留 "Cannot find name '$'." 部分
        //         const shortMessage = 'Cannot find name \'$\'.';
        //         return {
        //           ...marker,
        //           message: shortMessage,
        //         };
        //       }
        //       return marker;
        //     });
        //     // 更新标记（需要先清除再设置）
        //     monaco.editor.setModelMarkers(monaco.editor.getModel(uri)!, 'custom', filteredMarkers);
        //   });
        // });
        SystemFiles.sys.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.sys.url));
        SystemFiles.utl.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.utl.url));
        SystemFiles.var.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.var.url));
        SystemFiles.exp.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.exp.url));
        SystemFiles.ctx.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.ctx.url));
        SystemFiles.cur.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.cur.url));
        SystemFiles.doc.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.doc.url));
        SystemFiles.typ.model = monaco.editor.createModel('', 'typescript', monaco.Uri.parse(SystemFiles.typ.url));
        const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
        // 确保以下3个文件被初始化完成才返回实例，以达到延迟界面渲染的目的
        const tsWorker = await getWorker(SystemFiles.sys.model.uri, SystemFiles.doc.model.uri, SystemFiles.exp.model.uri);
        const editorIns = initEditor(monaco);
        const monacoEditor = new MonacoEditor(monaco, tsWorker, editorIns);
        const parent = window.parent;
        const ins = {
            getType: monacoEditor.getType,
            checkDoc: monacoEditor.checkDoc,
            checkExp: monacoEditor.checkExp,
            setSysCode: monacoEditor.setSysCode,
            setUtlCode: monacoEditor.setUtlCode,
            setVarCode: monacoEditor.setVarCode,
            setTypCode: monacoEditor.setTypCode,
            setCurCode: monacoEditor.setCurCode,
            getCurCode: monacoEditor.getCurCode,
            format: monacoEditor.format,
            insertVariable: monacoEditor.insertVariable,
            onLink: monacoEditor.onLink,
        };
        parent['@baseflow/schema']?.registerMonacoEditor(location.search.match(/namespace=(\w+)/)?.[1] || '1', ins);
        return monacoEditor;
    }
    let _MonacoEditorPromise;
    function initMonaco(monaco) {
        if (!_MonacoEditorPromise) {
            _MonacoEditorPromise = createMonacoEditor(monaco);
        }
        return _MonacoEditorPromise;
    }
    // // 获取定义位置
    // const definitions = await proxy.getDefinitionAtPosition(
    //     model.uri.toString(),
    //     position.lineNumber,
    //     position.column
    // );
    // // 获取补全项
    // const completions = await proxy.getCompletionsAtPosition(
    //     model.uri.toString(),
    //     position.lineNumber,
    //     position.column,
    //     {}

    exports.initMonaco = initMonaco;

}));
