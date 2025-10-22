import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

type Menu = {
  id: string;
  name: string;
  items: string[];
};

export default function App() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuName, setMenuName] = useState("");
  const [menuItems, setMenuItems] = useState("");
  const [isChefView, setIsChefView] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- CHEF FUNCTIONS ---
  const handleAddMenu = () => {
    if (!menuName.trim() || !menuItems.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newMenu: Menu = {
      id: Date.now().toString(),
      name: menuName.trim(),
      items: menuItems.split(",").map((item) => item.trim()),
    };

    setMenus((prev) => [...prev, newMenu]);
    setMenuName("");
    setMenuItems("");
    setShowModal(false);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setMenuName(menu.name);
    setMenuItems(menu.items.join(", "));
    setShowModal(true);
  };

  const handleUpdateMenu = () => {
    if (!menuName.trim()) return;

    setMenus((prev) =>
      prev.map((m) =>
        m.id === selectedMenu?.id
          ? { ...m, name: menuName, items: menuItems.split(",").map((i) => i.trim()) }
          : m
      )
    );

    setSelectedMenu(null);
    setMenuName("");
    setMenuItems("");
    setShowModal(false);
  };

  // --- USER FUNCTION ---
  const handleRequestOrder = (menu: Menu) => {
    Alert.alert("Order Requested", `You requested from ${menu.name}`);
  };

  // --- UI SWITCHER ---
  const toggleView = () => {
    setIsChefView((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Restaurant Management</Text>

      {/* Switch View */}
      <TouchableOpacity style={styles.switchButton} onPress={toggleView}>
        <Text style={styles.switchText}>
          {isChefView ? "Switch to User View" : "Switch to Chef View"}
        </Text>
      </TouchableOpacity>

      {isChefView ? (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Chef Menu Management</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add Menu</Text>
          </TouchableOpacity>

          <FlatList
            data={menus}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuCard}>
                <Text style={styles.menuName}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditMenu(item)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No menus yet. Add one!</Text>
            }
          />

          {/* Add/Edit Menu Modal */}
          <Modal visible={showModal} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {selectedMenu ? "Edit Menu" : "Create Menu"}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Menu name"
                  value={menuName}
                  onChangeText={setMenuName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Menu items (comma separated)"
                  value={menuItems}
                  onChangeText={setMenuItems}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowModal(false);
                      setSelectedMenu(null);
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={selectedMenu ? handleUpdateMenu : handleAddMenu}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        // USER VIEW
        <View style={styles.section}>
          <Text style={styles.subtitle}>Available Menus</Text>

          <FlatList
            data={menus}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuCard}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuItems}>
                  {item.items.join(", ")}
                </Text>
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={() => handleRequestOrder(item)}
                >
                  <Text style={styles.orderText}>Request Order</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No menus available.</Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  section: { flex: 1 },
  switchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  switchText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: { color: "#fff", textAlign: "center" },
  menuCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  menuName: { fontWeight: "bold", fontSize: 16 },
  menuItems: { color: "#555", marginTop: 5 },
  editButton: { marginTop: 5 },
  editButtonText: { color: "#007bff" },
  orderButton: {
    backgroundColor: "#ff9800",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  orderText: { color: "#fff", textAlign: "center" },
  emptyText: { textAlign: "center", color: "#777", marginTop: 20 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5 },
  cancelText: { color: "#000" },
  saveButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  saveText: { color: "#fff" },
});