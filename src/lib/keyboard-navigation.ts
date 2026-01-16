// Utility for handling keyboard navigation in forms

export type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'

/**
 * Handles Enter key press to move to next field or submit form
 */
export function handleEnterKeyNavigation(
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  options: {
    onNext?: () => void
    onSubmit?: () => void
    isLastField?: boolean
    preventDefault?: boolean
  }
) {
  if (e.key === 'Enter') {
    if (options.preventDefault !== false) {
      e.preventDefault()
    }

    if (options.isLastField && options.onSubmit) {
      // Last field - submit form
      options.onSubmit()
    } else if (options.onNext) {
      // Move to next field
      options.onNext()
    } else if (options.onSubmit) {
      // No next field defined, submit
      options.onSubmit()
    }
  }
}

/**
 * Gets the appropriate enterKeyHint based on field position
 */
export function getEnterKeyHint(
  position: 'first' | 'middle' | 'last' | 'only',
  fieldType: 'text' | 'email' | 'password' | 'number' | 'search' | 'textarea' = 'text'
): EnterKeyHint {
  if (fieldType === 'search') {
    return 'search'
  }

  if (position === 'last' || position === 'only') {
    return 'done'
  }

  if (position === 'first' || position === 'middle') {
    return 'next'
  }

  return 'next'
}

/**
 * Focuses the next input field in a form
 */
export function focusNextField(
  currentInput: HTMLInputElement | HTMLTextAreaElement,
  form?: HTMLFormElement
) {
  const formElement = form || currentInput.closest('form')
  if (!formElement) return

  const inputs = Array.from(
    formElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled])'
    )
  )

  const currentIndex = inputs.indexOf(currentInput)
  if (currentIndex < inputs.length - 1) {
    const nextInput = inputs[currentIndex + 1]
    nextInput.focus()
    // For mobile, scroll into view
    nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/**
 * Focuses the previous input field in a form
 */
export function focusPreviousField(
  currentInput: HTMLInputElement | HTMLTextAreaElement,
  form?: HTMLFormElement
) {
  const formElement = form || currentInput.closest('form')
  if (!formElement) return

  const inputs = Array.from(
    formElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled])'
    )
  )

  const currentIndex = inputs.indexOf(currentInput)
  if (currentIndex > 0) {
    const previousInput = inputs[currentIndex - 1]
    previousInput.focus()
    previousInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
