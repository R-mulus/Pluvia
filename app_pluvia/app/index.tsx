import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button variant="destructive">
        <Text>Destructive</Text>
      </Button>
      <Button className="rounded-bl-[10] rounded-tr-[10] rounded-tl-none rounded-br-none h-16 px-8">
        <Text className="font-outfit">Destructive</Text>
      </Button>
    </View>
  );
}
