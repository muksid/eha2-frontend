// app/pages/dashboards/departments/Modals/AddOrganizationModal.jsx
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {useEffect, useMemo} from "react";
import { Button, Input, Select } from "components/ui";
import {useDepartmentsContext} from "../Departments.context.js";
import {Combobox} from "../../../../../components/shared/form/Combobox.jsx";
import {HiXCircle} from "react-icons/hi2";
import {HiViewGridAdd} from "react-icons/hi";

const schema = Yup.object().shape({
  code: Yup.string().required("Код обязателен"),
  translations: Yup.object().shape({
    uz: Yup.string().required("Название (UZ) обязательно"),
    ru: Yup.string().required("Название (RU) обязательно"),
    en: Yup.string(),
  }),
  parent_id: Yup.number().nullable(),
  order_number: Yup.number().integer().min(0).nullable(),
});

export default function AddOrganization({ isOpen, close, parentId }) {
  const { createOrganization, organizations, refetch } = useDepartmentsContext();

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
      parent_id: parentId || null,
      order_number: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        code: "",
        translations: { uz: "", ru: "", en: "" },
        parent_id: parentId || null,
        order_number: 0,
      });
      setTimeout(() => setFocus("code"), 100);
    }
  }, [isOpen, parentId, reset, setFocus]);

  const onSubmit = async (formData) => {
    try {
      await createOrganization(formData);
      close();
      refetch();
    } catch (err) { /* empty */ }
  };

  const parentOptions = useMemo(() => {
    const opts = (organizations || []).map((o) => ({
      id: o.id,
      name: o.translations?.ru || o.code || "Без названия",
    }));
    return [{ id: null, name: "Нет" }, ...opts];
  }, [organizations]);

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
            <header className="flex h-14 items-center justify-between bg-gray-100 px-4 dark:bg-dark-800">
              <h3 className="text-base font-medium">Новая организация</h3>
              <button
                  type="button"
                  onClick={close}
                  className="flex size-7 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
              >
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
                          label="Родительская организация"
                          placeholder="Выберите..."
                          searchFields={["name"]}
                          highlight
                      />
                  )}
              />

              <Input label="Порядок" type="number" {...register("order_number")} />
            </div>

            <div className="flex justify-end gap-3 border-t p-4 dark:border-dark-500">
              <Button onClick={close} variant="flat" disabled={isSubmitting}>
                <HiXCircle className={'me-2'}/> Отмена
              </Button>
              <Button type="submit" color="primary" loading={isSubmitting}>
                <HiViewGridAdd className={'me-2'}/> Создать
              </Button>
            </div>
          </form>
        </TransitionChild>
      </Transition>
  );
}
