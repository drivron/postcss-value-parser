declare module "postcss-value-parser" {

	/** Returns the parsed node tree. */
	function valueParser(value: string): valueParser.ValueParser;


	namespace valueParser {
		interface ValueParser {
			/** The array of nodes. */
			nodes: Value[];

			/** Stringifies the node tree. */
			toString(): string;

			/** Walks each node inside ValueParser. See the documentation for walk() above. */
			walk(callback: (node: Value, index: number, nodes: Value[]) => void, bubble?: boolean): this;
		}

		interface BaseValue {
			/** The type of node (word, string, div, space, comment, or function). Each type is documented below. */
			type: string;

			/** Each node has a value property; but what exactly value means is specific to the node type. Details are documented for each type below. */
			value: string;

			/** The starting index of the node within the original source string. For example, given the source string 10px 20px, the word node whose value is 20px will have a sourceIndex of 5. */
			sourceIndex?: number;
		}

		/**
		 * The catch-all node type that includes keywords (e.g. no-repeat), quantities (e.g. 20px, 75%, 1.5), and hex colors (e.g. #e6e6e6).
		 *
		 * value: The "word" itself.
		 */
		interface WordValue extends BaseValue {
			type: 'word';
		}

		/**
		 * A quoted string value, e.g. "something" in content: "something";.
		 *
		 * value: The text content of the string.
		 */
		interface StringValue extends BaseValue {
			type: 'string';
			quote: string;
			unclosed?: boolean;
		}

		/**
		 * A divider, for example
		 *  , in animation-duration: 1s, 2s, 3s
		 *  / in border-radius: 10px / 23px
		 *  : in (min-width: 700px)
		 *
		 * value: The divider character. Either ,, /, or : (see examples above).
		 */
		interface DivValue extends BaseValue {
			type: 'div';
			/** Whitespace before the divider. */
			before?: string;
			/** Whitespace after the divider. */
			after?: string;
		}


		/**
		 * Whitespace used as a separator, e.g. occurring twice in border: 1px solid black;.
		 *
		 * value: The whitespace itself.
		 */
		interface SpaceValue extends BaseValue {
			type: 'space';
		}

		/**
		 * A CSS comment
		 *
		 * value: The comment value without the delimiters
		 */
		interface CommentValue extends BaseValue {
			type: 'comment';

			/** true if the comment was not closed properly. e.g. /* comment without an end. */
			unclosed?: boolean;
		}

		/**
		 * A CSS function, e.g. rgb(0,0,0) or url(foo.bar).
		 *
		 * Function nodes have nodes nested within them: the function arguments.
		 *
		 * value: The name of the function, e.g. rgb in rgb(0,0,0).
		 */
		interface FunctionValue extends BaseValue {
			type: 'function';

			/** Whitespace after the opening parenthesis and before the first argument, e.g. in rgb( 0,0,0). */
			before?: string;

			/** Whitespace before the closing parenthesis and after the last argument, e.g. in rgb(0,0,0 ). */
			after?: string;

			/** More nodes representing the arguments to the function. */
			nodes: Value[];

			/** true if the comment was not closed properly. e.g. /* comment without an end. */
			unclosed?: boolean;
		}

		type Value = WordValue | StringValue | DivValue | SpaceValue | FunctionValue;

		/**
		 * Parses quantity, distinguishing the number from the unit. Returns an object like the following
		 *
		 * If the quantity argument cannot be parsed as a number, returns false.
		 *
		 * This function does not parse complete values: you cannot pass it 1px solid black and expect px as the unit. Instead, you should pass it single quantities only. Parse 1px solid black, then pass it the stringified 1px node (a word node) to parse the number and unit.
		 * @param quantity
		 */
		function unit(quantity: string): { number: number, unit: string };


		/**
		 * Stringifies a node or array of nodes.
		 *
		 * The custom function is called for each node; return a string to override the default behaviour.
		 */
		function stringify(nodes: Value | Value[] | ValueParser, custom?: (node: Value) => string): string;


		/**
		 * Walks each provided node, recursively walking all descendent nodes within functions.
		 *
		 * Returning false in the callback will prevent traversal of descendent nodes (within functions). You can use this feature to for shallow iteration, walking over only the immediate children. Note: This only applies if bubble is false (which is the default).
		 *
		 * By default, the tree is walked from the outermost node inwards. To reverse the direction, pass true for the bubble argument.
		 *
		 * The callback is invoked with three arguments: callback(node, index, nodes).
		 */
		function walk(nodes: Value[], callback: (node: Value, index: number, nodes: Value[]) => void, bubble?: boolean): void;
	}
	export = valueParser;
}
