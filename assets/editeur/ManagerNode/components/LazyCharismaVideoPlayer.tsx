import { lazy, Suspense, type ComponentProps } from "react";

const CharismaVideoPlayer = lazy(() => import("../../components/video/CharismaVideoPlayer"));

export default function LazyCharismaVideoPlayer(props: ComponentProps<typeof CharismaVideoPlayer>) {
  return (
    <Suspense fallback={<div className={props.className ?? "w-full h-full bg-black"} aria-hidden="true" />}>
      <CharismaVideoPlayer {...props} />
    </Suspense>
  );
}
