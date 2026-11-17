import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { SectionHeader } from '../components/SectionHeader';

export const SettingsScreen = () => {
  const { theme, isDark, toggleTheme, themeMode, setThemeMode } = useTheme();
  const {
    partner1,
    partner2,
    course,
    section,
    pairNames,
    setPartner1,
    setPartner2,
    setCourse,
    setSection,
    resetLabProgress,
    labs,
    setLabStatus,
  } = useApp();

  const [savedNotice, setSavedNotice] = useState(false);

  const handlePartner1Change = (text) => {
    setPartner1(text);
  };

  const handlePartner2Change = (text) => {
    setPartner2(text);
  };

  const handleCourseChange = (text) => {
    setCourse(text);
  };

  const handleSectionChange = (text) => {
    setSection(text);
  };

  const handleSaveConfirmation = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 2500);
  };

  const handleMarkAllCompleted = () => {
    labs.forEach((l) => setLabStatus(l.id, 'Completed'));
    Alert.alert('Status Updated', 'All compilation labs marked as Completed.');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Laboratory Progress',
      'Revert all laboratory activities to their default statuses?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetLabProgress();
            Alert.alert('Reset Complete', 'Laboratory statuses have been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings & Global State</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Parameters configured here instantly sync across the Home Dashboard in real time
          </Text>
        </View>

        {/* 1. Global Theme Switcher with Native Switch and Visual Pills */}
        <SectionHeader
          title="Theme Mode (Dark / Light)"
          subtitle="Instant global appearance toggle"
        />

        <CustomCard padding={16} style={styles.card}>
          {/* Native Toggle Switch Row */}
          <View style={styles.switchRow}>
            <View style={styles.switchLabelGroup}>
              <Text style={styles.switchEmoji}>{isDark ? '🌙' : '☀️'}</Text>
              <View>
                <Text style={[styles.switchTitle, { color: theme.text }]}>
                  {isDark ? 'Dark Theme' : 'Light Theme'}
                </Text>
                <Text style={[styles.switchSubtitle, { color: theme.textMuted }]}>
                  Toggle switch to switch app-wide colors immediately
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : isDark ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          {/* Quick Segmented Buttons */}
          <View style={styles.themeSelectorRow}>
            {[
              { mode: 'light', label: 'Light Mode', icon: '☀️' },
              { mode: 'dark', label: 'Dark Mode', icon: '🌙' },
            ].map((item) => {
              const isSelected = isDark ? item.mode === 'dark' : item.mode === 'light';
              return (
                <TouchableOpacity
                  key={item.mode}
                  onPress={() => setThemeMode(item.mode)}
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surfaceAlt,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={styles.themeOptionIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.themeOptionLabel,
                      {
                        color: isSelected ? '#FFFFFF' : theme.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </CustomCard>

        {/* 2. Global Pair Profile Parameters */}
        <SectionHeader
          title="Pair Names & Course Section"
          subtitle="Updates the greeting banner on the Home Dashboard live"
        />

        <CustomCard padding={16} style={styles.card}>
          <CustomInput
            label="Partner 1 Name"
            value={partner1}
            onChangeText={handlePartner1Change}
            placeholder="Your Name"
            leftIcon={<Text>👨‍💻</Text>}
          />

          <CustomInput
            label="Partner 2 Name"
            value={partner2}
            onChangeText={handlePartner2Change}
            placeholder="Name of Your Partner"
            leftIcon={<Text>👩‍💻</Text>}
          />

          <CustomInput
            label="Course / Subject"
            value={course}
            onChangeText={handleCourseChange}
            placeholder="CS 321 - Mobile Computing"
            leftIcon={<Text>📚</Text>}
          />

          <CustomInput
            label="Class Section"
            value={section}
            onChangeText={handleSectionChange}
            placeholder="BSCS 4-B"
            leftIcon={<Text>🏫</Text>}
          />

          {/* Live Preview of Combined pairNames */}
          <View style={[styles.livePreviewBox, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[styles.previewLabel, { color: theme.textMuted }]}>
              Live Synced Header Parameter:
            </Text>
            <Text style={[styles.previewValue, { color: theme.primary }]}>
              👥 {pairNames}
            </Text>
          </View>

          <CustomButton
            title="Confirm & Sync All Parameters"
            variant="primary"
            size="md"
            fullWidth
            onPress={handleSaveConfirmation}
            style={{ marginTop: 10 }}
          />

          {savedNotice && (
            <View style={[styles.saveBanner, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.saveBannerText, { color: theme.success }]}>
                ✓ Parameters synced globally! Check the Home Dashboard.
              </Text>
            </View>
          )}
        </CustomCard>

        {/* 3. Laboratory Progress Actions */}
        <SectionHeader
          title="Compilation Management"
          subtitle="Controls for course milestone evaluation"
        />

        <CustomCard padding={16} style={styles.card}>
          <View style={styles.dataActionRow}>
            <CustomButton
              title="Mark All Done"
              variant="outline"
              size="sm"
              onPress={handleMarkAllCompleted}
              style={{ flex: 1, marginRight: 8 }}
            />
            <CustomButton
              title="Reset Progress"
              variant="danger"
              size="sm"
              onPress={handleResetData}
              style={{ flex: 1 }}
            />
          </View>
        </CustomCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  card: {
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000015',
  },
  switchLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  switchEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  switchSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  themeOptionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  themeOptionLabel: {
    fontSize: 12,
  },
  livePreviewBox: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  previewValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  saveBanner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBannerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dataActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
