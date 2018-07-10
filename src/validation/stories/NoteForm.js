import React from "react";
import { ValidatedForm } from "../Validated";
import ValidatedInput from "../ValidatedInput";
import { ButtonSuperPrimary, VerticalSpacer } from "../../FormComponents";

const TWEET_MAX_LENGTH = 3;

const NoteForm = () => {
  return (
    <ValidatedForm
      validations={{
        tweetLength: input =>
          input.length <= TWEET_MAX_LENGTH
            ? { hint: `${input.length}/${TWEET_MAX_LENGTH} characters` }
            : `${input.length}/${TWEET_MAX_LENGTH} characters`
      }}
      render={({ tweetLength }) => (
        <VerticalSpacer space={"1em"}>
          {tweetLength.watchFull(
            <ValidatedInput
              autoFocus
              placeholder="Tweet"
              type="textarea"
              onChange={e => tweetLength.validateValue(e.target.value)}
            />
          )}
          <ButtonSuperPrimary type="submit">Submit</ButtonSuperPrimary>
        </VerticalSpacer>
      )}
    />
  );
};

export default NoteForm;
