import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";

import { PropertyBottomSheet } from "./property-bottom-sheet";

type PropertySheetContextValue = {
  show: (content: ReactNode) => void;
  hide: () => void;
};

const PropertySheetContext = createContext<PropertySheetContextValue | null>(
  null,
);

export function usePropertySheet() {
  const context = useContext(PropertySheetContext);
  if (!context) {
    throw new Error(
      "usePropertySheet must be used within a PropertySheetProvider",
    );
  }
  return context;
}

type PropertySheetProviderProps = {
  children: ReactNode;
};

export function PropertySheetProvider({
  children,
}: PropertySheetProviderProps) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const show = useCallback((sheetContent: ReactNode) => {
    setContent(sheetContent);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <PropertySheetContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <PropertyBottomSheet visible={visible} onClose={hide}>
          {content}
        </PropertyBottomSheet>
      </View>
    </PropertySheetContext.Provider>
  );
}
