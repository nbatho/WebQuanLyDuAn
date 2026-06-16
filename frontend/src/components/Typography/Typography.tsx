/**
 * Typography Component System
 * ─────────────────────────────────────────────────────────────
 * Một source of truth cho tất cả text styles trong dự án.
 * Enforce design system — ngăn chặn hardcoded font-size/weight.
 *
 * Cách dùng:
 *   import { Text, Heading1, Heading2, Caption, Overline } from '@/components/Typography';
 *
 *   <Heading2>{t('settings.title')}</Heading2>
 *   <Text variant="body" color="secondary">Some description</Text>
 *   <Caption>12:30 PM · 8 tháng 6</Caption>
 *   <Overline>{t('sidebar.spaces')}</Overline>
 * ─────────────────────────────────────────────────────────────
 */

import React from 'react';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export type TypographyVariant =
  | 'display'    // 28px extrabold — hero titles, empty state headings
  | 'h1'         // 24px bold      — page main titles (dùng <h1>)
  | 'h2'         // 20px extrabold — section headings, modal titles
  | 'h3'         // 17px bold      — card titles, sub-sections
  | 'h4'         // 15px semibold  — label headers, group titles
  | 'body-lg'    // 15px medium    — primary body text, descriptions
  | 'body'       // 14px regular   — default body, form inputs
  | 'body-sm'    // 13px medium    — secondary text, sidebar items ← sidebar dùng cái này
  | 'caption'    // 12px medium    — timestamps, meta info, badges
  | 'overline'   // 11px extrabold + uppercase — section labels như "SPACES"
  | 'micro';     // 10px semibold  — tooltips, tiny badges

export type TypographyColor =
  | 'default'    // --color-on-surface (primary text)
  | 'secondary'  // --color-text-secondary
  | 'tertiary'   // --color-text-tertiary (muted)
  | 'brand'      // --color-primary (blue)
  | 'error'      // --color-error
  | 'success'    // --color-success
  | 'warning'    // --color-warning
  | 'inherit';   // kế thừa màu từ parent

export interface TextProps {
  /** Scale typography. Default: 'body' */
  variant?: TypographyVariant;
  /** Màu sắc theo Design Token. Default: 'default' */
  color?: TypographyColor;
  /** Override HTML element. Nếu không set, dùng semantic default. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional Tailwind classes */
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Truncate text với ellipsis */
  truncate?: boolean;
  /** Số dòng tối đa trước khi truncate */
  lineClamp?: 1 | 2 | 3 | 4 | 5;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// ──────────────────────────────────────────────────────────────
// Style Maps — ánh xạ variant → Tailwind classes
// Chỉ dùng CSS variable-based classes để tự động light/dark
// ──────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  display:   'text-display  font-extrabold leading-tight tracking-tight',
  h1:        'text-h1       font-bold       leading-tight tracking-tight',
  h2:        'text-h2       font-extrabold  leading-snug',
  h3:        'text-h3       font-bold       leading-snug',
  h4:        'text-h4       font-semibold   leading-normal',
  'body-lg': 'text-body-lg  font-medium     leading-relaxed',
  body:      'text-body     font-normal     leading-relaxed',
  'body-sm': 'text-body-sm  font-medium     leading-relaxed',
  caption:   'text-caption  font-medium     leading-normal',
  overline:  'text-overline font-extrabold  leading-none uppercase tracking-[0.06em]',
  micro:     'text-micro    font-semibold   leading-none',
};

const COLOR_CLASSES: Record<TypographyColor, string> = {
  default:   'text-[var(--color-on-surface)]',
  secondary: 'text-[var(--color-text-secondary)]',
  tertiary:  'text-[var(--color-text-tertiary)]',
  brand:     'text-[var(--color-primary)]',
  error:     'text-[var(--color-error)]',
  success:   'text-[var(--color-success)]',
  warning:   'text-[var(--color-warning)]',
  inherit:   'text-inherit',
};

// Semantic HTML element defaults theo variant
const DEFAULT_ELEMENT: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
  display:   'h1',
  h1:        'h1',
  h2:        'h2',
  h3:        'h3',
  h4:        'h4',
  'body-lg': 'p',
  body:      'p',
  'body-sm': 'p',
  caption:   'span',
  overline:  'span',
  micro:     'span',
};

const LINE_CLAMP_CLASSES: Record<NonNullable<TextProps['lineClamp']>, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
};

// ──────────────────────────────────────────────────────────────
// Base Component
// ──────────────────────────────────────────────────────────────

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'default',
  as,
  className = '',
  children,
  id,
  truncate,
  lineClamp,
  style,
  onClick,
}) => {
  const Tag = (as ?? DEFAULT_ELEMENT[variant]) as React.ElementType;

  const classes = [
    // Reset margin/padding để tránh browser defaults
    'm-0 p-0',
    VARIANT_CLASSES[variant],
    COLOR_CLASSES[color],
    truncate ? 'truncate' : '',
    lineClamp ? LINE_CLAMP_CLASSES[lineClamp] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      id={id}
      className={classes}
      style={style}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

// ──────────────────────────────────────────────────────────────
// Convenience exports — shorthand cho các pattern phổ biến
// ──────────────────────────────────────────────────────────────

/** 28px extrabold — hero/empty state headings */
export const Display: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="display" {...props} />;

/** 24px bold — page main title, dùng <h1> */
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="h1" {...props} />;

/** 20px extrabold — section headings, modal titles */
export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="h2" {...props} />;

/** 17px bold — card titles, sub-sections */
export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="h3" {...props} />;

/** 15px semibold — label headers, group titles */
export const Heading4: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="h4" {...props} />;

/** 15px medium — primary body text */
export const BodyLg: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="body-lg" {...props} />;

/** 13px medium — secondary text, sidebar items */
export const BodySm: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="body-sm" {...props} />;

/** 12px medium + tertiary color — timestamps, meta info */
export const Caption: React.FC<Omit<TextProps, 'variant'>> = ({
  color = 'tertiary',
  ...props
}) =>
  <Text variant="caption" color={color} as="span" {...props} />;

/** 11px extrabold uppercase — section labels như "SPACES" */
export const Overline: React.FC<Omit<TextProps, 'variant'>> = ({
  color = 'secondary',
  ...props
}) =>
  <Text variant="overline" color={color} as="span" {...props} />;

/** 10px semibold — tooltips, tiny badges */
export const Micro: React.FC<Omit<TextProps, 'variant'>> = (props) =>
  <Text variant="micro" {...props} />;

export default Text;
