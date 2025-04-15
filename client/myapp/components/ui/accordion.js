import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.trigger}>
        <Text style={styles.title}>{title}</Text>
        <Feather
          name="chevron-down"
          size={20}
          style={[styles.icon, open && styles.iconOpen]}
        />
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const Accordion = () => {
  return (
    <View>
      <AccordionItem title="What is this app?">
        <Text style={{ color: '#ccc' }}>
          This app lets you select the best profile photo for your purpose using AI.
        </Text>
      </AccordionItem>

      <AccordionItem title="How do I upload photos?">
        <Text style={{ color: '#ccc' }}>
          You can drag and drop, or use the upload button to select photos from your gallery.
        </Text>
      </AccordionItem>

      <AccordionItem title="Is my data private?">
        <Text style={{ color: '#ccc' }}>
          Yes, we never store your images. Everything is processed locally or securely with our AI API.
        </Text>
      </AccordionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: '#444',
    marginBottom: 10,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  icon: {
    color: '#fff',
    transform: [{ rotate: '0deg' }],
  },
  iconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingTop: 8,
    paddingBottom: 12,
  },
});

export default Accordion;
