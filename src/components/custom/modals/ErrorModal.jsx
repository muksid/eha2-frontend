import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, {Fragment, useEffect} from "react";
import { Button } from "components/ui";
import { useDisclosure } from "hooks";

export function ErrorModal({ message }) {
    const [isOpen, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (message) {
            open();
        } else {
            close();
        }
    }, [message, open, close]);

    if (!message) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
                onClose={close}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
                </TransitionChild>

                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <DialogPanel className="scrollbar-sm relative flex max-w-md flex-col overflow-y-auto rounded-lg bg-white px-4 py-10 text-center transition-all dark:bg-dark-700 sm:px-5">
                        <ExclamationTriangleIcon className="mx-auto inline size-28 shrink-0 text-danger" />
                        <div className="mt-4 px-20">
                            <DialogTitle as="h3" className="text-2xl text-gray-800 dark:text-dark-100">
                                Ошибка!
                            </DialogTitle>
                            <p className="mt-2 text-gray-600 dark:text-dark-300">
                                {message}
                            </p>
                            <Button onClick={close} color="error" className="mt-6">
                                Закрыть
                            </Button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
