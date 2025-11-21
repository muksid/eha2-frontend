import React, {useEffect, useRef, useState} from "react";
import {DocumentEditor} from "@onlyoffice/document-editor-react";
import { Page } from "components/shared/Page";
import {BASE_URL, ONLY_OFFICE_DOCUMENT_SERVER_URL} from "../../../../configs/auth.config.js";

export default function Editor() {
    const [config, setConfig] = useState(null);
    const [token, setToken] = useState(null);
    const [shouldRenderEditor, setShouldRenderEditor] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const editorInstanceRef = useRef(null);
    const docEditorRef = useRef(null);

    useEffect(() => {
        fetch(`${BASE_URL}/api/onlyoffice/config`)
            .then(res => res.json())
            .then(data => {
                setConfig(data.config);
                setToken(data.token);
                setTimeout(() => setShouldRenderEditor(true), 100);
            })
            .catch(err => console.error('Config load error:', err));

        return () => {
            setShouldRenderEditor(false);

            setTimeout(() => {
                try {
                    if (window.DocEditor && window.DocEditor.instances) {
                        Object.keys(window.DocEditor.instances).forEach(key => {
                            const instance = window.DocEditor.instances[key];
                            if (instance && typeof instance.destroyEditor === 'function') {
                                instance.destroyEditor();
                            }
                        });
                    }

                    const iframes = document.querySelectorAll('iframe[name^="frameEditor"]');
                    iframes.forEach(iframe => {
                        if (iframe.parentNode) {
                            iframe.parentNode.removeChild(iframe);
                        }
                    });
                } catch (error) {
                    console.error('Cleanup error:', error);
                }
            }, 0);
        };
    }, []);

    const handleDocumentReady = (event) => {
        console.log("Document is loaded");
        editorInstanceRef.current = event;

        // Получаем инстанс редактора
        docEditorRef.current = window.DocEditor.instances['docxEditor'];
    };

    // Функция для принудительного сохранения
    const handleSaveDocument = () => {
        if (!docEditorRef.current) {
            console.error('Editor instance not found');
            return;
        }

        setIsSaving(true);

        try {
            // Метод 1: processSaveResult (рекомендуемый)
            docEditorRef.current.processSaveResult(true);

            console.log('Save command sent to OnlyOffice');

            // Показываем уведомление
            setTimeout(() => {
                setIsSaving(false);
                alert('Документ отправлен на сохранение');
            }, 1000);
        } catch (error) {
            console.error('Error saving document:', error);
            setIsSaving(false);
        }
    };

    if (!config || !token || !shouldRenderEditor) {
        return (
            <Page title="Editor">
                <div className="flex items-center justify-center h-full">
                    <div>Loading editor...</div>
                </div>
            </Page>
        );
    }

    return (
        <Page title="Editor">
            {/* Кнопка сохранения */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
                <h2 className="text-lg font-semibold">Document Editor</h2>
                <button
                    onClick={handleSaveDocument}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить документ'}
                </button>
            </div>

            <div style={{ width: '100%', height: 'calc(100vh - 112px)' }}>
                <DocumentEditor
                    id="docxEditor"
                    documentServerUrl={ONLY_OFFICE_DOCUMENT_SERVER_URL}
                    config={{
                        ...config,
                        token: token
                    }}
                    events_onDocumentReady={handleDocumentReady}
                    onLoadComponentError={onLoadComponentError}
                />
            </div>
        </Page>
    );
}

function onLoadComponentError(errorCode, errorDescription) {
    switch (errorCode) {
        case -1:
            console.log(errorDescription);
            break;
        case -2:
            console.log(errorDescription);
            break;
        case -3:
            console.log(errorDescription);
            break;
    }
}
