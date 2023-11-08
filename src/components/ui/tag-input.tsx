// Source: https://github.com/daniel-figcaption/tag-input
import { cn } from "@/lib/utils";
import React, { ChangeEventHandler, KeyboardEventHandler, useId } from "react";
import { useState } from "react";

/**
 * TagInput
 *
 * Tags are pieces of text that can be used as keywords for online
 * content such as blog posts.
 *
 * This is a React component that provides a user-friendly way to input
 * tags.
 *
 * Adding:
 * The user can type in a new tag and then add it by either typing a
 * comma (,) or hitting the Enter key.
 *
 * Removing:
 * Tags can be removed by clicking the X on the undesired tag.
 * The most recent tag can be removed by hitting the Backspace key
 * twice (first to highlight, secondly to remove).
 *
 */

const TagInput: React.FC<{
  /*
   * To keep this component as reusable as possible I have added
   * some props here which mimic how an <input type="text" /> works.
   * The goal here would be to drop this component in a form and have
   * it be used just like any other input without any extra hassle.
   *
   * A next step for me here would be to add a value prop, and if provided
   * then this would become a controlled component, i.e. state for the
   * list of tags is managed in the parent component.
   */
  id?: string;
  name?: string;
  autoFocus?: boolean;
  defaultValue: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
}> = ({ className, ...props }) => {
  /*
   * We need a unique HTML ID to relate the <label> element to the
   * <input />. If one hasn't been passed in as props, let's create a
   * globally unique one using the useId hook.
   */
  const uniqueId = useId();
  const htmlId = props.id || uniqueId;

  const [inputText, setInputText] = useState("");
  const [tags, setTags] = useState<string[]>(props.defaultValue);
  /*
   * This deletionIsPending state variable is used to keep track of
   * whether or not the Backspace key has been pressed once.
   */
  const [deletionIsPending, setDeletionIsPending] = useState(false);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const text = e.target.value;

    /*
     * Every time text is entered let's check to see if a comma has
     * been typed, and then add it as a new tag if so.
     * Text can also ben entered via copy/paste for example, so in that
     * case let's loop through for allinstances of commas.
     */
    const newTags: string[] = [];
    const newText = text.replaceAll(
      /([^\s,;]+)(,|;|\s)/g,
      (_wholeMatch: string, tagText: string) => {
        newTags.push(tagText.trim());
        return "";
      }
    );

    setTags((tags) => [...new Set([...tags, ...newTags])]);
    setDeletionIsPending(false);
    setInputText(newText);
    props.onValueChange([...new Set([...tags, ...newTags])]);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.currentTarget.value;

    /*
     * When the Enter key is hit, add the text as a new tag.
     * We need to make sure we prevent the default Enter action in this
     * case, which is submitting the form.
     *
     * It's not good practice to override expected default behaviours, but
     * in this case it's more obvious that the Enter key would add a new tag.
     */
    if (e.key === "Enter") {
      e.preventDefault();

      if (text !== "" && !tags.includes(text.trim())) {
        setTags((tags) => [...new Set([...tags, text.trim()])]);
        setInputText("");
        props.onValueChange([...new Set([...tags, text.trim()])]);
      }
    }

    /*
     * When the Backspace key is hit, highlight the to-be-deleted item
     * and then delete it on the second press.
     */
    if (e.key === "Backspace" && text === "") {
      if (deletionIsPending) {
        setTags((tags) => tags.slice(0, tags.length - 1));
        props.onValueChange(tags.slice(0, tags.length - 1));
        setDeletionIsPending(false);
      } else {
        setDeletionIsPending(true);
      }
    }
  };

  return (
    /*
     * Here I'm using TailwindCSS, which is a way to keep CSS and HTML all in one file.
     */
    <div
      className={cn(
        "flex w-full min-h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <ul className="flex items-center flex-wrap gap-1 sm:gap-1.5">
        {tags.map((tag, i) => {
          const isLastTag = i === tags.length - 1;
          return (
            /*
             * key prop:
             * For the purposes of this limited demo I'm allowing duplicate tags.
             * In a real world scenario you might want to prevent these and instead
             * highlight the already added tag in some way when the user tries to add a
             * duplicate.
             *
             * Because tags are not unique I'm using a key value which is a combination
             * of the tag text and index.
             *
             * If we committed to allowing duplicates, a better approach might be to store
             * tags as objects consisting of text and a unique ID value to use as key.
             */
            <TagItem
              key={`${tag}_${i}`}
              tag={tag}
              isUpForDeletion={isLastTag && deletionIsPending}
              onDelete={() => {
                setTags((tags) => tags.filter((tagB) => tagB !== tag));
                props.onValueChange(tags.filter((tagB) => tagB !== tag));
              }}
            />
          );
        })}
        <li className="relative flex-1 first:ml-1">
          {/*
           * Ordinarily <input /> elements cannot be dynamically resized based on their
           * value. To get around this, an invisible <span> tag holding the same contents
           * as the input is used to define the size with the <input /> positioned absolutely
           * over the top.
           *
           * An alternative approach would be to eschew the <input /> entirely and instead
           * use a <span> with contenteditable activated, which would then dynamically resize.
           *
           * For better integration with forms I've used the classic <input /> here.
           */}
          <input
            type="text"
            id={htmlId}
            className="absolute z-30 inset-0 w-full h-full bg-transparent outline-none"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoFocus={props.autoFocus}
          />
          <span className="opacity-0 whitespace-pre h-6 flex items-center justify-center">
            {inputText}&nbsp;
          </span>
        </li>
      </ul>
      {/*
       * A hidden input here holds the true serializable value of the field, which is a
       * comma-separated text string of all the tags.
       */}
      <input type="hidden" name={props.name} value={tags.join(",")} />
      {/*
       * This label invisibly covers the entire TagInput and is used to capture click
       * events so that they focus the <input />
       */}
      <label className="absolute inset-0 z-20 cursor-text" htmlFor={htmlId} />
    </div>
  );
};

export default TagInput;

/**
 * TagItem
 *
 * A small, blue tag.
 *
 * This component is used to render TagInput.
 *
 */

const TagItem: React.FC<{
  tag: string;
  isUpForDeletion?: boolean;
  onDelete: () => void;
}> = ({ tag, isUpForDeletion, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete();
  };

  const divClassName = isUpForDeletion
    ? "scale-[0.8] bg-red-300 text-red-950 shadow-red-500"
    : "scale-[0.8] bg-gray-200 text-gray-950 shadow-gray-300";

  return (
    <li
      className={`
        bg-gray-100 text-gray-950 h-6 px-2 rounded 
        leading-none whitespace-nowrap 
        flex items-center justify-center gap-1 
        
      `}
    >
      {tag}
      <button
        type="button"
        className="relative z-30 group w-5 h-5 flex items-center justify-center rounded-full outline-none"
        title="Delete"
        onClick={handleDeleteClick}
      >
        <div
          className={`
            ${divClassName} 
            absolute inset-0 
            transform transition-transform 
            rounded-full shadow-inner 
            outline outline-0
            group-focus:outline-2 
            group-hover:bg-red-300 group-focus:bg-red-300 
            group-hover:text-red-950 group-focus:text-red-950 
            group-hover:shadow-red-500 group-focus:shadow-red-500
            group-hover:outline-red-600 group-focus:outline-red-600
            group-active:bg-red-400
          `}
        />
        <svg
          className={`
            relative z-10 w-3 h-3 rounded overflow-hidden
            fill-transparent stroke-current stroke-1
          `}
          viewBox="0 0 7 7"
          width="7"
          height="7"
        >
          <line x1="2" y1="2" x2="5" y2="5" vectorEffect="non-scaling-stroke" />
          <line x1="5" y1="2" x2="2" y2="5" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="sr-only">Delete</span>
      </button>
    </li>
  );
};
