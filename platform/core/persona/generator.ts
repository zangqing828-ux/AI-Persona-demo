/**
 * Generic Persona Generator
 * Generates persona profiles based on configuration
 */

import { nanoid } from 'nanoid';
import type {
  AttributeConfig,
  AttributeType,
  JsonValue,
} from '../../shared/types/platform.js';
import type {
  AttributeValueGenerator,
  PersonaGenerationOptions,
  PersonaGenerationResult,
  PersonaProfile,
  PersonaTypeDefinition,
} from './types.js';

// =============================================================================
// Default Attribute Value Generators
// =============================================================================

class DefaultValueGenerator implements AttributeValueGenerator {
  generate(attribute: AttributeConfig, context?: Record<string, JsonValue>): JsonValue {
    const { type, options, min, max } = attribute;

    switch (type) {
      case 'string':
        return this.generateString(attribute, context);

      case 'number':
        return this.generateNumber(attribute, context);

      case 'boolean':
        return Math.random() > 0.5;

      case 'enum':
        if (!options || options.length === 0) {
          throw new Error(`Enum attribute ${attribute.id} has no options`);
        }
        return options[Math.floor(Math.random() * options.length)];

      case 'multi-enum':
        if (!options || options.length === 0) {
          throw new Error(`Multi-enum attribute ${attribute.id} has no options`);
        }
        const count = Math.floor(Math.random() * options.length) + 1;
        return this.shuffleArray([...options]).slice(0, count);

      case 'range':
        if (min === undefined || max === undefined) {
          throw new Error(`Range attribute ${attribute.id} missing min or max`);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;

      default:
        throw new Error(`Unknown attribute type: ${type}`);
    }
  }

  private generateString(attribute: AttributeConfig, context?: Record<string, JsonValue>): string {
    // Generate a random string based on attribute name and context
    const prefix = context?.name || attribute.name;
    const suffix = Math.floor(Math.random() * 10000);
    return `${prefix}_${suffix}`;
  }

  private generateNumber(attribute: AttributeConfig, context?: Record<string, JsonValue>): number {
    const min = attribute.min ?? 0;
    const max = attribute.max ?? 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// =============================================================================
// Persona Generator
// =============================================================================

export class PersonaGenerator {
  private valueGenerator: AttributeValueGenerator;

  constructor(valueGenerator?: AttributeValueGenerator) {
    this.valueGenerator = valueGenerator ?? new DefaultValueGenerator();
  }

  /**
   * Generate persona profiles based on type definition
   */
  generate(
    typeDefinition: PersonaTypeDefinition,
    options: PersonaGenerationOptions
  ): PersonaGenerationResult {
    const startTime = Date.now();
    const profiles: PersonaProfile[] = [];

    for (let i = 0; i < options.count; i++) {
      const profile = this.generateSingleProfile(typeDefinition, options);
      profiles.push(profile);
    }

    const generationTime = Date.now() - startTime;

    return {
      profiles,
      metadata: {
        totalGenerated: profiles.length,
        generationTime,
        seed: options.seed,
      },
    };
  }

  /**
   * Generate a single persona profile
   */
  private generateSingleProfile(
    typeDefinition: PersonaTypeDefinition,
    options: PersonaGenerationOptions
  ): PersonaProfile {
    const attributes: Record<string, JsonValue> = {};
    const context: Record<string, JsonValue> = {};

    // Generate attributes in order (in case some depend on others)
    for (const attribute of typeDefinition.attributes) {
      // Skip if this attribute has a constraint that conflicts
      if (options.constraints && attribute.id in options.constraints) {
        attributes[attribute.id] = options.constraints[attribute.id];
        continue;
      }

      const value = this.valueGenerator.generate(attribute, context);
      attributes[attribute.id] = value;
      context[attribute.id] = value;
    }

    return {
      id: nanoid(),
      typeId: typeDefinition.id,
      name: this.generateName(attributes),
      attributes,
      createdAt: new Date(),
    };
  }

  /**
   * Generate a human-readable name from attributes
   */
  private generateName(attributes: Record<string, JsonValue>): string {
    // Try to find common name attributes
    const nameAttributes = ['name', 'firstName', 'firstName', '名', '姓名'];

    for (const attr of nameAttributes) {
      if (attr in attributes && typeof attributes[attr] === 'string') {
        return attributes[attr] as string;
      }
    }

    // Fallback to generated name
    return `Persona_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Validate a profile against a schema
   */
  validate(profile: PersonaProfile, schema: { parse: (data: unknown) => unknown }): boolean {
    try {
      schema.parse(profile.attributes);
      return true;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create a persona generator with custom value generators
 */
export function createPersonaGenerator(
  valueGenerator?: AttributeValueGenerator
): PersonaGenerator {
  return new PersonaGenerator(valueGenerator);
}

/**
 * Generate profiles with a simple configuration
 */
export function generateProfiles(
  typeDefinition: PersonaTypeDefinition,
  count: number
): PersonaProfile[] {
  const generator = new PersonaGenerator();
  const result = generator.generate(typeDefinition, { count });
  return result.profiles;
}
