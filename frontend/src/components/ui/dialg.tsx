import { tv } from "@/lib/tv";
import {
  Dialog,
  DialogTrigger as PrimitiveTrigger,
  Modal,
  ModalOverlay,
  type DialogProps,
  composeRenderProps,
} from "react-aria-components";

const styles = tv({
  slots: {
    dialog:
      "bg-background entering:animate-in exiting:animate-out exiting:fade-out-0 entering:fade-in-0 exiting:zoom-out-95 entering:zoom-in-95 z-50 grid w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
    overlay:
      "fixed inset-0 z-50 overflow-y-auto bg-black/50 flex min-h-full items-center justify-center backdrop-blur-sm entering:animate-in entering:fade-in entering:duration-300 entering:ease-out exiting:animate-out exiting:fade-out exiting:duration-200 exiting:ease-in",
  },
});

const DialogTrigger = PrimitiveTrigger;

const DialogContent = (props: DialogProps) => {
  const { className, ...rest } = props;
  return (
    <ModalOverlay isDismissable className={styles().overlay()}>
      <Modal
        className={composeRenderProps(className, (className, renderProps) =>
          styles().dialog({
            ...renderProps,
            className,
          })
        )}
      >
        <Dialog className="outline-hidden grid gap-4" {...rest} />
      </Modal>
    </ModalOverlay>
  );
};

export { DialogTrigger, DialogContent };
