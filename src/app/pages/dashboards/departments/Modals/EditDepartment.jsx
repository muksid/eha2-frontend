// app/pages/dashboards/departments/Modals/EditDepartmentModal.jsx
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import {XMarkIcon, TrashIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {useEffect, useMemo, useState} from "react";

import { useDepartmentsContext } from "../Departments.context.js";
import { Button, Input, Select } from "components/ui";
import {Combobox} from "../../../../../components/shared/form/Combobox.jsx";
import {useDisclosure} from "../../../../../hooks/index.js";
import {ConfirmModal} from "../../../../../components/shared/ConfirmModal.jsx";
import {HiViewGridAdd} from "react-icons/hi";
import {HiXCircle} from "react-icons/hi2";

const schema = Yup.object().shape({
    code: Yup.string().required("Код обязателен"),
    translations: Yup.object().shape({
        uz: Yup.string().required("Название (UZ) обязательно"),
        ru: Yup.string().required("Название (RU) обязательно"),
        en: Yup.string(),
    }),
    parent_id: Yup.number().nullable(),
    order_number: Yup.number().integer().min(1).nullable(),
});

export default function EditDepartment({ data, isOpen, close }) {
    const { updateDepartment, deleteDepartment, departments, refetch } = useDepartmentsContext();
    const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmState, setConfirmState] = useState("pending");

    const {
        register,
        handleSubmit,
        control,
        reset,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
            translations: { uz: "", ru: "", en: "" },
            parent_id: null,
            order_number: 0,
        },
    });

    // Заполнение формы при открытии
    useEffect(() => {
        if (isOpen && data) {
            // Формируем объект переводов
            const translationsObj = {
                uz: data.meta?.translations?.uz || "",
                ru: data.meta?.translations?.ru || data.title || "",
                en: data.meta?.translations?.en || "",
            };

            reset({
                code: data.meta?.code || "",
                translations: translationsObj,
                parent_id: data?.meta?.parent_id,
                order_number: data?.meta?.order_number ?? 1,
            });

            setTimeout(() => setFocus("code"), 100);
        }
    }, [isOpen, data, reset, setFocus]);

    const onSubmit = async (formData) => {
        try {
            await updateDepartment(data.id, {
                ...formData,
                org_unit_id: data.org_unit_id,
            });
            close();
            refetch();
        } catch (err) { /* empty */ }
    };

    const messages = {
        pending: {
            Icon: ExclamationTriangleIcon,
            title: "Удалить департамент?",
            description: "Это действие нельзя отменить. Департамент будет удалён навсегда.",
            actionText: "Удалить",
        },
        success: { title: "Департамент удалён" },
        error: { description: "Ошибка при удалении. Попробуйте позже." },
    };

    const handleDelete = async () => {
        openConfirm();
    };

    const onConfirmDelete = async () => {
        setConfirmLoading(true);
        try {
            await deleteDepartment(data.id);
            setConfirmState("success");
            setTimeout(() => {
                closeConfirm();
                close(); // Закрываем модалку редактирования
                refetch();
            }, 1000);
        } catch (err) {
            setConfirmState("error");
            setConfirmLoading(false);
        }
    };

    // Фильтруем: нельзя выбрать себя, только из той же org_unit
    const parentOptions = useMemo(() => {
        const opts = (departments || [])
            .filter((d) => d.org_unit_id === data.org_unit_id && d.id !== data.id)
            .map((d) => ({
                id: d.id,
                name: d.translations?.ru || d.code || "Без названия",
            }));
        return [{ id: null, name: "Нет" }, ...opts];
    }, [departments, data]);

    return (
        <Transition appear show={isOpen} as={Dialog} className="relative z-100" onClose={close}>
            <TransitionChild
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            />

            <TransitionChild
                as={DialogPanel}
                enter="ease-out transform-gpu transition-transform duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in transform-gpu transition-transform duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                className="fixed right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-white dark:bg-dark-700"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
                    {/* Header */}
                    <header className="flex h-14 items-center justify-between bg-gray-100 px-4 dark:bg-dark-800">
                        <h3 className="text-base font-medium">Редактировать департамент</h3>
                        <button
                            type="button"
                            onClick={close}
                            className="flex size-7 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                        >
                            <XMarkIcon className="size-4.5" />
                        </button>
                    </header>

                    {/* Form Body */}
                    <div className="grow space-y-4 overflow-y-auto p-4">
                        <Input
                            label="Код"
                            {...register("code")}
                            error={errors.code?.message}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Input
                                label="Название (UZ)"
                                {...register("translations.uz")}
                                error={errors.translations?.uz?.message}
                            />
                            <Input
                                label="Название (RU)"
                                {...register("translations.ru")}
                                error={errors.translations?.ru?.message}
                            />
                            <Input
                                label="Название (EN)"
                                {...register("translations.en")}
                            />
                        </div>

                        {/* Родительский департамент */}
                        <Controller
                            control={control}
                            name="parent_id"
                            render={({ field: { value, onChange } }) => (
                                <Combobox
                                    data={parentOptions}
                                    displayField="name"
                                    value={parentOptions.find((o) => o.id === value) || parentOptions[0]}
                                    onChange={(sel) => onChange(sel?.id ?? null)}
                                    label="Родительский департамент"
                                    placeholder="Выберите..."
                                    searchFields={["name"]}
                                    highlight
                                />
                            )}
                        />

                        <Input
                            label="Порядок"
                            type="number"
                            {...register("order_number")}
                            error={errors.order_number?.message}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between border-t border-gray-200 p-4 dark:border-dark-500">
                        <Button onClick={handleDelete} color="error" className="flex items-center gap-2">
                            <TrashIcon className="size-4.5" />
                            Удалить
                        </Button>

                        <div className="flex gap-3">
                            <Button onClick={close} variant="flat" disabled={isSubmitting}>
                                <HiXCircle className={'me-2'}/> Отмена
                            </Button>
                            <Button type="submit" color="primary" loading={isSubmitting}>
                                <HiViewGridAdd className={'me-2'}/> Сохранить
                            </Button>
                        </div>
                    </div>

                    {/* ConfirmModal */}
                    <ConfirmModal
                        show={confirmOpen}
                        onClose={closeConfirm}
                        messages={messages}
                        onOk={onConfirmDelete}
                        confirmLoading={confirmLoading}
                        state={confirmState}
                    />
                </form>
            </TransitionChild>
        </Transition>
    );
}
