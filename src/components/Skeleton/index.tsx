import { List, ListItem, SkeletonBlock } from "framework7-react";

export const Skeleton = ({ documentPage }: { documentPage?: boolean }) => {
  return (
    <>
      {documentPage && (
        <div className="w-full flex mb-4">
          <SkeletonBlock
            slot="media"
            tag={"div"}
            width={"75px"}
            height={"18px"}
            effect={"wave"}
            borderRadius={"6px"}
          />
        </div>
      )}
      <List mediaList className="skeleton-text skeleton-effect-wave my-0 w-full">
        {[1, 2, 3].map((num) => (
          <ListItem
            title="Title title title title title"
            text="Lorem ipsum dolor sit amet amet"
            key={num}
          >
            <SkeletonBlock
              slot="media"
              tag={"a"}
              width={"44px"}
              height={"44px"}
              effect={"wave"}
              borderRadius={"6px"}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};
