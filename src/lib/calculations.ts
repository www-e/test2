export type OperationType = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'

export class CalculationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CalculationError'
  }
}

/**
 * Performs mathematical operation: leftOperand [operation] rightOperand
 * @param leftOperand - The result from previous calculation or starting number
 * @param operation - The type of operation to perform
 * @param rightOperand - The user-provided number
 * @returns The calculated result
 * @throws CalculationError if division by zero or invalid operation
 */
export function calculate(
  leftOperand: number,
  operation: OperationType,
  rightOperand: number
): number {
  // Validate inputs
  if (!isFinite(leftOperand) || !isFinite(rightOperand)) {
    throw new CalculationError('Invalid operands: numbers must be finite')
  }

  let result: number

  switch (operation) {
    case 'ADD':
      result = leftOperand + rightOperand
      break
    case 'SUBTRACT':
      result = leftOperand - rightOperand
      break
    case 'MULTIPLY':
      result = leftOperand * rightOperand
      break
    case 'DIVIDE':
      if (rightOperand === 0) {
        throw new CalculationError('Division by zero is not allowed')
      }
      result = leftOperand / rightOperand
      break
    default:
      throw new CalculationError(`Invalid operation type: ${operation}`)
  }

  // Ensure result is finite (prevent Infinity/-Infinity)
  if (!isFinite(result)) {
    throw new CalculationError('Calculation resulted in invalid number')
  }

  return result
}

/**
 * Validates if operation type is supported
 */
export function isValidOperation(operation: string): operation is OperationType {
  return ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'].includes(operation)
}

/**
 * Gets the symbol for display purposes
 */
export function getOperationSymbol(operation: OperationType): string {
  const symbols: Record<OperationType, string> = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '×',
    DIVIDE: '÷',
  }
  return symbols[operation]
}
