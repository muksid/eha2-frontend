import { useMemo } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import {HiLibrary} from "react-icons/hi";
import {HiBuildingOffice2} from "react-icons/hi2";

export default function OrgChartPanel({ selectedNode, departments, organizations }) {
    const buildSubtree = (node) => {
        if (!node) return null;

        const isOrg = node.isOrgUnit;
        const children = [];

        if (isOrg) {
            const childOrgs = organizations
                .filter((org) => org.parent_id === node.id)
                .map((org) => buildSubtree({ ...org, isOrgUnit: true }));

            const rootDeps = departments
                .filter((d) => d.org_unit_id === node.id && !d.parent_id)
                .map((d) => buildSubtree({ ...d, isOrgUnit: false }));

            children.push(...childOrgs, ...rootDeps);
        } else {
            const childDeps = departments
                .filter((d) => d.parent_id === node.id)
                .map((d) => buildSubtree({ ...d, isOrgUnit: false }));

            children.push(...childDeps);
        }

        return {
            expanded: true,
            type: isOrg ? 'organization' : 'department',
            className: isOrg
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md',
            style: {
                borderRadius: '16px',
                border: 'none',
            },
            data: {
                name: node.translations?.ru || node.code,
                code: node.code,
                isOrgUnit: isOrg
            },
            children: children.length > 0 ? children : []
        };
    };

    const chartData = useMemo(() => {
        if (!selectedNode) return [];
        return [buildSubtree(selectedNode)].filter(Boolean);
    }, [selectedNode, departments, organizations]);

    const nodeTemplate = (node) => {
        if (node.type === 'organization' || node.type === 'department') {
            const isOrg = node.data.isOrgUnit;

            return (
                <div style={{
                    minWidth: '220px',
                    maxWidth: '220px',
                    width: '220px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        gap: '0.5rem'
                    }}>

                        <div style={{ marginBottom: '0.5rem' }}>
                            {isOrg ? (
                                <HiLibrary className="size-6 ltr:mr-3 rtl:ml-3 text-white dark:text-white" />
                            ) : (
                                <HiBuildingOffice2 className="size-6 ltr:mr-3 rtl:ml-3 text-white dark:text-white" />
                            )}
                        </div>

                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            lineHeight: '1.25',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            width: '100%'
                        }}>
                            {node.data.name}
                        </div>

                        <div style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginTop: '0.25rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)'
                        }}>
                            {isOrg ? '🏢 Организация' : '📁 Департамент'}
                        </div>
                    </div>
                </div>
            );
        }
        return node.label;
    };

    if (!selectedNode) {
        return (
            <div className="flex flex-column items-center justify-center h-full text-gray-500 dark:text-dark-300 gap-3">
                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg font-medium">Выберите узел в дереве</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900 rounded-lg">
            {/* Заголовок */}
            <div className="mb-6 p-4 bg-white dark:bg-dark-700 rounded-xl shadow-sm border border-gray-200 dark:border-dark-500">
                <div className="flex align-items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                        selectedNode.isOrgUnit
                            ? 'bg-indigo-100 dark:bg-indigo-900/30'
                            : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                        {selectedNode.isOrgUnit ? (
                            <HiLibrary className="size-6 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                            <HiBuildingOffice2 className="size-6 text-purple-600 dark:text-purple-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-dark-300 font-medium">
                            {selectedNode.isOrgUnit ? "Организация" : "Департамент"}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {selectedNode.translations?.ru || selectedNode.code}
                        </h3>
                    </div>
                </div>
            </div>

            {/* График */}
            <div className="card overflow-x-auto bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6">
                <style>{`
                    /* Базовые стили для организационной диаграммы */
                    .p-organizationchart {
                        overflow: visible;
                    }
                    
                    .p-organizationchart-table {
                        border-spacing: 1rem 0;
                        margin: 0 auto;
                    }
                    
                    .p-organizationchart-node {
                        padding: 0 0.5rem;
                        vertical-align: top;
                        position: relative;
                    }
                    
                    .p-organizationchart-node-content {
                        display: inline-block;
                        position: relative;
                        overflow: visible;
                    }
                    
                    /* Центрирование chevron */
                    .p-organizationchart .p-node-toggler {
                        position: absolute;
                        bottom: -0.75rem;
                        left: 50%;
                        transform: translateX(-50%);
                        margin: 0;
                        z-index: 2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding-bottom: 6px;
                    }
                    
                    /* Линии */
                    .p-organizationchart-line-down {
                        margin: 0 auto;
                    }
                    
                    .p-organizationchart-line-left,
                    .p-organizationchart-line-right,
                    .p-organizationchart-line-top {
                        border-color: rgba(156, 163, 175, 0.3);
                    }
                    
                    /* Ряды узлов */
                    .p-organizationchart-nodes {
                        display: table-row;
                    }
                    
                    .p-organizationchart-nodes > td {
                        padding: 1.5rem 0.5rem 1rem 0.5rem;
                        text-align: center;
                        vertical-align: top;
                    }
                `}</style>

                <OrganizationChart
                    value={chartData}
                    nodeTemplate={nodeTemplate}
                />
            </div>
        </div>
    );
}
