import { describe, it, expect } from 'vitest'
import { calculate, getOperationSymbol, isValidOperation, CalculationError } from '@/lib/calculations'

describe('calculations', () => {
  describe('calculate function', () => {
    it('should perform addition correctly', () => {
      expect(calculate(5, 'ADD', 3)).toBe(8)
      expect(calculate(0, 'ADD', 0)).toBe(0)
      expect(calculate(-5, 'ADD', 3)).toBe(-2)
    })

    it('should perform subtraction correctly', () => {
      expect(calculate(5, 'SUBTRACT', 3)).toBe(2)
      expect(calculate(0, 'SUBTRACT', 5)).toBe(-5)
      expect(calculate(-5, 'SUBTRACT', -3)).toBe(-2)
    })

    it('should perform multiplication correctly', () => {
      expect(calculate(5, 'MULTIPLY', 3)).toBe(15)
      expect(calculate(0, 'MULTIPLY', 5)).toBe(0)
      expect(calculate(-5, 'MULTIPLY', 3)).toBe(-15)
    })

    it('should perform division correctly', () => {
      expect(calculate(10, 'DIVIDE', 2)).toBe(5)
      expect(calculate(7, 'DIVIDE', 2)).toBe(3.5)
      expect(calculate(-10, 'DIVIDE', 2)).toBe(-5)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => calculate(10, 'DIVIDE', 0)).toThrow('Division by zero is not allowed')
    })

    it('should throw error for invalid operation type', () => {
      expect(() => calculate(10, 'INVALID' as any, 5)).toThrow('Invalid operation type: INVALID')
    })

    it('should throw error for non-finite numbers', () => {
      expect(() => calculate(Infinity, 'ADD', 5)).toThrow('Invalid operands: numbers must be finite')
      expect(() => calculate(5, 'ADD', NaN)).toThrow('Invalid operands: numbers must be finite')
      expect(() => calculate(NaN, 'ADD', 5)).toThrow('Invalid operands: numbers must be finite')
    })

    it('should throw error when result is infinite', () => {
      expect(() => calculate(1, 'DIVIDE', 0)).toThrow('Division by zero is not allowed') // This gets caught before infinite result
    })
  })

  describe('getOperationSymbol function', () => {
    it('should return correct symbols for operations', () => {
      expect(getOperationSymbol('ADD')).toBe('+')
      expect(getOperationSymbol('SUBTRACT')).toBe('-')
      expect(getOperationSymbol('MULTIPLY')).toBe('×')
      expect(getOperationSymbol('DIVIDE')).toBe('÷')
    })
  })

  describe('isValidOperation function', () => {
    it('should return true for valid operations', () => {
      expect(isValidOperation('ADD')).toBe(true)
      expect(isValidOperation('SUBTRACT')).toBe(true)
      expect(isValidOperation('MULTIPLY')).toBe(true)
      expect(isValidOperation('DIVIDE')).toBe(true)
    })

    it('should return false for invalid operations', () => {
      expect(isValidOperation('INVALID')).toBe(false)
      expect(isValidOperation('MODULO')).toBe(false)
      expect(isValidOperation('EXPONENT')).toBe(false)
    })
  })

  describe('CalculationError class', () => {
    it('should create an error with proper name', () => {
      const error = new CalculationError('Test message')
      expect(error.name).toBe('CalculationError')
      expect(error.message).toBe('Test message')
    })
  })
})