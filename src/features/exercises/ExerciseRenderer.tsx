"use client";
import type { RendererProps } from "./shared";
import ChoiceExercise from "./ChoiceExercise";
import MatchExercise from "./MatchExercise";
import BuildExercise from "./BuildExercise";
import TranslateExercise from "./TranslateExercise";
import ListenExercise from "./ListenExercise";

/** Single dispatch point: add a new exercise type by adding a renderer and one case here. */
export default function ExerciseRenderer(props: RendererProps) {
  const { exercise: ex } = props;
  switch (ex.type) {
    case "mcq": case "fill": return <ChoiceExercise {...props} exercise={ex} />;
    case "listen": return <ListenExercise {...props} exercise={ex} />;
    case "match": return <MatchExercise {...props} exercise={ex} />;
    case "build": return <BuildExercise {...props} exercise={ex} />;
    case "translate": return <TranslateExercise {...props} exercise={ex} />;
  }
}
