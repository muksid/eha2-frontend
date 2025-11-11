// index.jsx
import { useEffect, useState } from "react";
import { Page } from "components/shared/Page";
import Tree from "../../../../components/custom/Tree.jsx";
import OrgChartPanel from "../../../../components/custom/OrgChartPanel.jsx";
import { useDepartmentsContext } from "./Departments.context.js";
import { Header } from "./Header.jsx";
import { DepartmentsProvider } from "./DepartmentsProvider.jsx";

function DepartmentsContent() {
    const { organizations, departments, loading, error, refetch } = useDepartmentsContext();
    const [treeData, setTreeData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const buildTree = (orgUnits, departments, lang = "ru") => {
        // 1. Создаем мапу всех организаций
        const orgMap = {};
        orgUnits.forEach((ou) => {
            orgMap[ou.id] = {
                id: ou.id,
                title: ou.translations?.[lang] || ou.code,
                parent_id: ou.parent_id,
                children: [],
                isOrgUnit: true,
                meta: ou,
            };
        });

        // 2. Создаем мапу всех департаментов
        const depMap = {};
        departments.forEach((dep) => {
            depMap[dep.id] = {
                id: dep.id,
                title: dep.translations?.[lang] || dep.code,
                parent_id: dep.parent_id,
                org_unit_id: dep.org_unit_id,
                children: [],
                isOrgUnit: false,
                meta: dep,
            };
        });

        // 3. Строим иерархию департаментов
        Object.values(depMap).forEach((dep) => {
            if (dep.parent_id && depMap[dep.parent_id]) {
                depMap[dep.parent_id].children.push(dep);
            }
        });

        // 4. Добавляем корневые департаменты к организациям
        Object.values(depMap).forEach((dep) => {
            if (!dep.parent_id && dep.org_unit_id && orgMap[dep.org_unit_id]) {
                orgMap[dep.org_unit_id].children.push(dep);
            }
        });

        // 5. Строим иерархию организаций
        const rootOrgs = [];
        Object.values(orgMap).forEach((org) => {
            if (org.parent_id && orgMap[org.parent_id]) {
                // Дочерняя организация - добавляем к родителю
                orgMap[org.parent_id].children.push(org);
            } else {
                // Корневая организация
                rootOrgs.push(org);
            }
        });

        return rootOrgs;
    };

    useEffect(() => {
        if (organizations && departments) {
            const tree = buildTree(organizations, departments, "ru");
            setTreeData(tree);
        }
    }, [organizations, departments]);

    const handleNodeClick = (node) => {
        // Добавляем дополнительные данные для OrgChartPanel
        const enrichedNode = {
            ...node.meta,
            isOrgUnit: node.isOrgUnit,
            translations: node.meta.translations,
            code: node.meta.code,
        };
        setSelectedNode(enrichedNode);
    };

    if (loading) return <div className="p-8 text-center">Загрузка...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
            {/* Левая колонка: Tree */}
            <div className="lg:col-span-1">
                <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 mb-4">
                    Дерево
                </h2>
                <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-4 h-[calc(100vh-200px)] overflow-auto">
                    <Tree tree={treeData} onNodeClick={handleNodeClick} />
                </div>
            </div>

            {/* Правая колонка: OrgChart */}
            <div className="lg:col-span-2">
                <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 mb-4">
                    Структура
                </h2>
                <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm h-[calc(100vh-200px)]">
                    <OrgChartPanel
                        selectedNode={selectedNode}
                        departments={departments}
                        organizations={organizations}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Departments() {
    return (
        <Page title="DepartmentsPage">
            <DepartmentsProvider>
                <DepartmentsContent />
            </DepartmentsProvider>
        </Page>
    );
}
