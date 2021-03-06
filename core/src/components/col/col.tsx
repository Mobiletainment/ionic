import { Component, Element, Listen, Prop } from '@stencil/core';

import { isMatch } from '../../utils/media';

const SUPPORTS_VARS = !!(CSS && CSS.supports && CSS.supports('--a', '0'));
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

@Component({
  tag: 'ion-col',
  styleUrl: 'col.scss',
  shadow: true
})
export class Col {
  [key: string]: any;

  @Element() el!: HTMLStencilElement;

  /**
   * The amount to offset the column, in terms of how many columns it should shift to the right
   * of the total available.
   */
  @Prop() offset?: string;

  /**
   * The amount to offset the column for xs screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() offsetXs?: string;

  /**
   * The amount to offset the column for sm screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() offsetSm?: string;

  /**
   * The amount to offset the column for md screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() offsetMd?: string;

  /**
   * The amount to offset the column for lg screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() offsetLg?: string;

  /**
   * The amount to offset the column for xl screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() offsetXl?: string;

  /**
   * The amount to pull the column, in terms of how many columns it should shift to the left of
   * the total available.
   */
  @Prop() pull?: string;

  /**
   * The amount to pull the column for xs screens, in terms of how many columns it should shift
   * to the left of the total available.
   */
  @Prop() pullXs?: string;
  /**
   * The amount to pull the column for sm screens, in terms of how many columns it should shift
   * to the left of the total available.
   */
  @Prop() pullSm?: string;
  /**
   * The amount to pull the column for md screens, in terms of how many columns it should shift
   * to the left of the total available.
   */
  @Prop() pullMd?: string;
  /**
   * The amount to pull the column for lg screens, in terms of how many columns it should shift
   * to the left of the total available.
   */
  @Prop() pullLg?: string;
  /**
   * The amount to pull the column for xl screens, in terms of how many columns it should shift
   * to the left of the total available.
   */
  @Prop() pullXl?: string;

  /**
   * The amount to push the column, in terms of how many columns it should shift to the right
   * of the total available.
   */
  @Prop() push?: string;

  /**
   * The amount to push the column for xs screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() pushXs?: string;

  /**
   * The amount to push the column for sm screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() pushSm?: string;

  /**
   * The amount to push the column for md screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() pushMd?: string;

  /**
   * The amount to push the column for lg screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() pushLg?: string;

  /**
   * The amount to push the column for xl screens, in terms of how many columns it should shift
   * to the right of the total available.
   */
  @Prop() pushXl?: string;

  /**
   * The size of the column, in terms of how many columns it should take up out of the total
   * available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() size?: string;

  /**
   * The size of the column for xs screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeXs?: string;

  /**
   * The size of the column for sm screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeSm?: string;

  /**
   * The size of the column for md screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeMd?: string;

  /**
   * The size of the column for lg screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeLg?: string;

  /**
   * The size of the column for xl screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeXl?: string;

  @Listen('window:resize')
  onResize() {
    this.el.forceUpdate();
  }

  // Loop through all of the breakpoints to see if the media query
  // matches and grab the column value from the relevant prop if so
  private getColumns(property: string) {
    let matched;

    for (const breakpoint of BREAKPOINTS) {
      const matches = isMatch(breakpoint);

      // Grab the value of the property, if it exists and our
      // media query matches we return the value
      const columns = this[property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)];

      if (matches && columns !== undefined) {
        matched = columns;
      }
    }

    // Return the last matched columns since the breakpoints
    // increase in size and we want to return the largest match
    return matched;
  }

  private calculateSize() {
    const columns = this.getColumns('size');

    // If size wasn't set for any breakpoint
    // or if the user set the size without a value
    // it means we need to stick with the default and return
    // e.g. <ion-col size-md>
    if (!columns || columns === '') {
      return;
    }

    // If the size is set to auto then don't calculate a size
    const colSize = (columns === 'auto')
      ? 'auto'
      // If CSS supports variables we should use the grid columns var
      : SUPPORTS_VARS ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)`
        // Convert the columns to a percentage by dividing by the total number
        // of columns (12) and then multiplying by 100
        : ((columns / 12) * 100) + '%';

    return {
      'flex': `0 0 ${colSize}`,
      'width': `${colSize}`,
      'max-width': `${colSize}`
    };
  }

  // Called by push, pull, and offset since they use the same calculations
  private calculatePosition(property: string, modifier: string) {
    const columns = this.getColumns(property);

    if (!columns) {
      return;
    }

    // If the number of columns passed are greater than 0 and less than
    // 12 we can position the column, else default to auto
    const amount = SUPPORTS_VARS
      // If CSS supports variables we should use the grid columns var
      ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)`
      // Convert the columns to a percentage by dividing by the total number
      // of columns (12) and then multiplying by 100
      : (columns > 0 && columns < 12) ? (columns / 12 * 100) + '%' : 'auto';

    return {
      [modifier]: amount
    };
  }

  private calculateOffset() {
    return this.calculatePosition('offset', 'margin-left');
  }

  private calculatePull() {
    return this.calculatePosition('pull', 'right');
  }

  private calculatePush() {
    return this.calculatePosition('push', 'left');
  }

  hostData() {
    return {
      style: {
        ...this.calculateOffset(),
        ...this.calculatePull(),
        ...this.calculatePush(),
        ...this.calculateSize(),
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
