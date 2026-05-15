import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuModal = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuButton}>
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)} // Handles Android back button
      >
        {/* Transparent overlay to close modal on click outside */}
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.item}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.item}>
              <Text>Option 2</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuButton: { padding: 10, backgroundColor: '#2196F3', borderRadius: 5 },
  buttonText: { color: 'white' },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: 180, 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    elevation: 5 // Shadow for Android
  },
  item: { paddingVertical: 10 }
});

export default MenuModal;
