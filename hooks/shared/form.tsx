import { Button } from '@/components/ui/button'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext, useFormContext } = createFormHookContexts()


function SubscribeButton({ label }: { label: string }) {
    const form = useFormContext()
    return (
        <Button className="w-full" type="submit" disabled={form.state.isSubmitting}>
            {label}
        </Button>
    )
}

export const { useAppForm, withForm } = createFormHook<
    Record<string, never>,
    { SubscribeButton: typeof SubscribeButton }
>({
    fieldComponents: {},
    formComponents: { SubscribeButton },
    fieldContext,
    formContext
})