// app/pages/dashboards/departments/Modals/EditOrganizationModal.jsx
import { Dialog, DialogPanel, Transition, TransitionChild} from "@headlessui/react";
import {XMarkIcon, TrashIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {useEffect, useMemo, useState} from "react";

import { Button, Input, Select } from "components/ui";
import {useDepartmentsContext} from "../Departments.context.js";
import {Combobox} from "../../../../../components/shared/form/Combobox.jsx";
import {useDisclosure} from "../../../../../hooks/index.js";
import {ConfirmModal} from "../../../../../components/shared/ConfirmModal.jsx";
import {HiViewGridAdd} from "react-icons/hi";
import {HiXCircle} from "react-icons/hi2";

const schema = Yup.object().shape({
  code: Yup.string().required(),
  translations: Yup.object().shape({
    uz: Yup.string().required(),
    ru: Yup.string().required(),
    en: Yup.string(),
  }),
  parent_id: Yup.number().nullable(),
  order_number: Yup.number().integer().min(0).nullable(),
});

export default function EditOrganization({ data, isOpen, close }) {
  const { updateOrganization, deleteOrganization, organizations, refetch } = useDepartmentsContext();
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

  useEffect(() => {
    if (isOpen && data) {
      // Защита: translations может быть массивом или объектом внутри meta
      let translationsObj = { uz: "", ru: "", en: "" };

      if (data.meta?.translations) {
        if (Array.isArray(data.meta.translations)) {
          translationsObj = data.meta.translations.reduce(
              (acc, t) => ({ ...acc, [t.lang_code]: t.name || "" }),
              translationsObj
          );
        } else {
          // Объект: { uz: "...", ru: "...", en: "..." }
          translationsObj = {
            uz: data.meta.translations.uz || "",
            ru: data.meta.translations.ru || data.title || "",
            en: data.meta.translations.en || "",
          };
        }
      }

      reset({
        code: data.meta?.code || "",
        translations: translationsObj,
        parent_id: data.meta?.parent_id,
        order_number: data.meta?.order_number ?? 1,
      });

      setTimeout(() => setFocus("code"), 100);
    }
  }, [isOpen, data, reset, setFocus]);

  const onSubmit = async (formData) => {
    try {
      await updateOrganization(data.id, formData);
      close();
      refetch();
    } catch (err) { /* empty */ }
  };

  const messages = {
    pending: {
      Icon: ExclamationTriangleIcon,
      title: "Удалить организацию?",
      description: "Все связанные департаменты и данные будут удалены. Это нельзя отменить.",
      actionText: "Удалить",
    },
    success: { title: "Организация удалена" },
    error: { description: "Ошибка при удалении. Попробуйте позже." },
  };

  const handleDelete = () => {
    openConfirm();
  };

  const onConfirmDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteOrganization(data.id);
      setConfirmState("success");
      setTimeout(() => {
        closeConfirm();
        close();
        refetch();
      }, 1000);
    } catch (err) {
      setConfirmState("error");
      setConfirmLoading(false);
    }
  };

  const parentOptions = useMemo(() => {
    const opts = (organizations || [])
        .filter((o) => o.id !== data.id)
        .map((o) => ({
          id: o.id,
          name: o.translations?.ru || o.code || "Без названия",
        }));
    return [{ id: null, name: "Нет" }, ...opts];
  }, [organizations, data]);

  return (
      <Transition appear show={isOpen} as={Dialog} className="relative z-100" onClose={close}>
        <TransitionChild as="div" enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />

        <TransitionChild as={DialogPanel} enter="ease-out transform-gpu transition-transform duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="ease-in transform-gpu transition-transform duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full" className="fixed right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-white dark:bg-dark-700">
          <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <header className="flex h-14 items-center justify-between bg-gray-100 px-4 dark:bg-dark-800">
              <h3 className="text-base font-medium">Редактировать</h3>
              <button type="button" onClick={close} className="flex size-7 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
                <XMarkIcon className="size-4.5" />
              </button>
            </header>

            <div className="grow space-y-4 overflow-y-auto p-4">
              <Input label="Код" {...register("code")} error={errors.code?.message} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="UZ" {...register("translations.uz")} error={errors.translations?.uz?.message} />
                <Input label="RU" {...register("translations.ru")} error={errors.translations?.ru?.message} />
                <Input label="EN" {...register("translations.en")} />
              </div>

              <Controller
                  control={control}
                  name="parent_id"
                  render={({ field: { value, onChange } }) => (
                      <Combobox
                          data={parentOptions}
                          displayField="name"
                          value={parentOptions.find((o) => o.id === value) || parentOptions[0]}
                          onChange={(sel) => onChange(sel?.id ?? null)}
                          label="Родитель"
                          placeholder="Выберите..."
                          searchFields={["name"]}
                          highlight
                      />
                  )}
              />

              <Input label="Порядок" type="number" {...register("order_number")} />
            </div>

            <div className="flex justify-between border-t p-4 dark:border-dark-500">
              <Button onClick={handleDelete} color="error" className="gap-2">
                <TrashIcon className="size-4.5" /> Удалить
              </Button>
              <div className="flex gap-3">
                <Button onClick={close} variant="flat" disabled={isSubmitting}><HiXCircle className={'me-2'}/> Отмена</Button>
                <Button type="submit" color="primary" loading={isSubmitting}><HiViewGridAdd className={'me-2'}/> Сохранить</Button>
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
