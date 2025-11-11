import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Button, Collapse } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { useDisclosure } from "hooks";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import {
    AddOrganization,
    EditOrganization,
    AddDepartment,
    EditDepartment,
} from "../../app/pages/dashboards/departments/Modals/index.js";
import {HiLibrary, HiOutlineFolderAdd, HiPencil, HiViewGridAdd} from "react-icons/hi";

export default function Tree({ tree, level = 0, onNodeClick }) {
    const [show, setShow] = useState({});
    const { isRtl } = useLocaleContext();
    const Icon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

    const toggle = (id) => {
        setShow((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Фильтруем только корневые узлы (без parent_id) на верхнем уровне
    const rootNodes = level === 0
        ? tree.filter(node => !node.parent_id)
        : tree;

    return (
        <>
            {rootNodes.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    level={level}
                    show={show}
                    toggle={toggle}
                    isRtl={isRtl}
                    Icon={Icon}
                    onNodeClick={onNodeClick}
                />
            ))}
        </>
    );
}

function TreeNode({ node, level, show, toggle, isRtl, Icon, onNodeClick }) {
    const [editOpen, { open: openEdit, close: closeEdit }] = useDisclosure();
    const [addOrgOpen, { open: openAddOrg, close: closeAddOrg }] = useDisclosure();
    const [addDeptOpen, { open: openAddDept, close: closeAddDept }] = useDisclosure();

    return (
        <div
            style={{
                paddingLeft: isRtl ? 0 : level * 16,
                paddingRight: isRtl ? level * 16 : 0,
            }}
        >
            <div
                className={clsx(
                    "flex w-full cursor-pointer items-center rounded px-2 py-1 font-medium tracking-wide outline-none transition-all hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 dark:hover:bg-dark-600 dark:hover:text-dark-100 dark:focus:bg-dark-600 dark:focus:text-dark-100",
                    show[node.id] && "text-gray-800 dark:text-dark-100"
                )}
                onClick={() => onNodeClick?.(node)}
            >
                {node.children?.length ? (
                    <Icon
                        className={clsx(
                            "size-5 transition-transform ltr:mr-1 rtl:ml-1",
                            show[node.id] && "rotate-90 rtl:-rotate-90"
                        )}
                        onClick={(e) => {
                            e.stopPropagation(); // Предотвращаем вызов onNodeClick
                            toggle(node.id);
                        }}
                    />
                ) : (
                    <div className="w-5 ltr:mr-1 rtl:ml-1" />
                )}

                {node.isOrgUnit ? (
                    <HiLibrary className="size-6 ltr:mr-3 rtl:ml-3 text-black dark:text-white" />
                ) : (
                    <HiBuildingOffice2 className="size-6 ltr:mr-3 rtl:ml-3 text-blue-500 dark:text-blue-400" />
                )}

                <span className="">{node.title}</span>

                <ActionMenu
                    node={node}
                    openEdit={openEdit}
                    openAddOrg={openAddOrg}
                    openAddDept={openAddDept}
                />
            </div>

            <Collapse in={show[node.id]}>
                {node.children?.length ? (
                    <Tree
                        tree={node.children}
                        level={level + 1}
                        onNodeClick={onNodeClick}
                    />
                ) : null}
            </Collapse>

            {/* Модальные окна */}
            {node.isOrgUnit ? (
                <>
                    <EditOrganization data={node} isOpen={editOpen} close={closeEdit} />
                    <AddOrganization isOpen={addOrgOpen} close={closeAddOrg} parentId={node.id} />
                    <AddDepartment
                        isOpen={addDeptOpen}
                        close={closeAddDept}
                        orgUnitId={node.id}
                    />
                </>
            ) : (
                <>
                    <EditDepartment data={node} isOpen={editOpen} close={closeEdit} />
                    <AddDepartment
                        isOpen={addDeptOpen}
                        close={closeAddDept}
                        parentId={node.id}
                        orgUnitId={node.org_unit_id}
                    />
                </>
            )}
        </div>
    );
}

function ActionMenu({ node, openEdit, openAddOrg, openAddDept }) {
    return (
        <Menu as="div" className="relative inline-block text-start ms-2">
            <MenuButton as="div" onClick={(e) => e.stopPropagation()}>
                <Button isIcon variant="flat" className="size-7 rounded-full hover:bg-gray-200">
                    <EllipsisHorizontalIcon className="size-4.5" />
                </Button>
            </MenuButton>

            <Transition
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-100 mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:left-0 rtl:right-0"
            >
                <MenuItem>
                    {({ focus }) => (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit();
                            }}
                            className={clsx(
                                "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                                focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                            )}
                        >
                            <HiPencil className={'me-2'}></HiPencil> Edit
                        </button>
                    )}
                </MenuItem>

                {node.isOrgUnit && (
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAddOrg();
                                }}
                                className={clsx(
                                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                                    focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                                )}
                            >
                                <HiViewGridAdd className={'me-2'}></HiViewGridAdd> Add Organization
                            </button>
                        )}
                    </MenuItem>
                )}

                <MenuItem>
                    {({ focus }) => (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openAddDept();
                            }}
                            className={clsx(
                                "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                                focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                            )}
                        >
                            <HiOutlineFolderAdd className={'me-2'}></HiOutlineFolderAdd> Add Department
                        </button>
                    )}
                </MenuItem>
            </Transition>
        </Menu>
    );
}

Tree.propTypes = {
    tree: PropTypes.array.isRequired,
    level: PropTypes.number,
    onNodeClick: PropTypes.func,
};
