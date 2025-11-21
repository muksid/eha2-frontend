import React, {useEffect, useRef, useState} from "react";
import {DocumentEditor} from "@onlyoffice/document-editor-react";
import { Page } from "components/shared/Page";
import {BASE_URL, ONLY_OFFICE_DOCUMENT_SERVER_URL} from "../../../../configs/auth.config.js";

export default function Editor() {
    const [config, setConfig] = useState(null);
    const [token, setToken] = useState(null);
    const [shouldRenderEditor, setShouldRenderEditor] = useState(false);
    const editorInstanceRef = useRef(null);

    useEffect(() => {
        fetch(`${BASE_URL}/api/onlyoffice/config`)
            .then(res => res.json())
            .then(data => {
                setConfig(data.config);
                setToken(data.token);
                // Даём время на подгрузку конфига
                setTimeout(() => setShouldRenderEditor(true), 100);
            })
            .catch(err => console.error('Config load error:', err));

        // Cleanup при размонтировании
        return () => {
            setShouldRenderEditor(false);

            // Задержка для корректного удаления
            setTimeout(() => {
                try {
                    // Очищаем все инстансы OnlyOffice
                    if (window.DocEditor && window.DocEditor.instances) {
                        Object.keys(window.DocEditor.instances).forEach(key => {
                            const instance = window.DocEditor.instances[key];
                            if (instance && typeof instance.destroyEditor === 'function') {
                                instance.destroyEditor();
                            }
                        });
                    }

                    // Удаляем iframe если остался
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
            <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
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
