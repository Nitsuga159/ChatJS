export interface ScrollItems {
    /**
     * Identifier key for each item, used for API representation.
     */
    identifierItemKey: string | null;
    /**
     * Maximum number of items to render in the user interface.
     */
    maxItems: number;
    /**
     * Maximum number of virtual items to store in execution.
     */
    maxVirtualItems: number;
    /**
     * List of items to render in the user interface.
     */
    items: any[];
    /**
     * List of virtual items to store.
     */
    virtualItems: any[];
    /**
     * Boolean indicating whether fetching should continue for items above the viewport.
     */
    continueFetchingUp: boolean;
    /**
     * Boolean indicating whether fetching should continue for items below the viewport.
     */
    continueFetchingDown: boolean;
    /**
     * ScrollTop registered.
     */
    lastScrollStop: number;
};

/**
 * Interface representing the initial state of scrollItems, used for managing items in a scrollable list.
 * @template T The type of items in the scrollable list.
 */
export interface InitialStateScrollItems {
    /**
     * Key-value pairs representing scroll items configurations.
     */
    [key: string]: ScrollItems
}