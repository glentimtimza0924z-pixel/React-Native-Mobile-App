import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';
import { CustomButton } from '../components/CustomButton';
import { Badge } from '../components/Badge';

export const LabDetailScreen = ({ route, navigation }) => {
  const { lab } = route.params;
  const { theme, isDark } = useTheme();
  const { labs, toggleLabStatus, deleteLab } = useApp();

  // Find latest state of current lab from global state (or fallback to passed lab)
  const currentLab = labs.find((l) => l.id === lab.id) || lab;

  const confirmDeleteCurrentLab = () => {
    Alert.alert(
      'Delete Activity',
      `Are you sure you want to remove "${currentLab.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteLab(currentLab.id);
            navigation.goBack();
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
      {/* Top Navigation Bar */}
      <View style={[styles.navBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: theme.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[styles.navTitle, { color: theme.text }]}
        >
          Activity #{currentLab.number}
        </Text>
        <Badge label={currentLab.status} variant={currentLab.status} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lab Title Banner */}
        <CustomCard style={styles.bannerCard} padding={16}>
          <View style={styles.bannerHeader}>
            <View
              style={[
                styles.numberPill,
                { backgroundColor: theme.primaryLight },
              ]}
            >
              <Text style={[styles.numberPillText, { color: theme.primary }]}>
                ACTIVITY #{currentLab.number}
              </Text>
            </View>
            <Text style={styles.bannerIcon}>{currentLab.icon || '📱'}</Text>
          </View>
          <Text style={[styles.labTitle, { color: theme.text }]}>
            {currentLab.title}
          </Text>
          <Text style={[styles.labCategory, { color: theme.primary }]}>
            {currentLab.category} • Due: {currentLab.dueDate}
          </Text>
          <Text style={[styles.labDescription, { color: theme.textSecondary }]}>
            {currentLab.description}
          </Text>

          {/* Action Row */}
          <View style={styles.statusControlRow}>
            <Text style={[styles.statusControlLabel, { color: theme.textMuted }]}>
              Status: <Text style={{ color: theme.text, fontWeight: '700' }}>{currentLab.status}</Text>
            </Text>
            <View style={styles.bannerBtnGroup}>
              <TouchableOpacity
                onPress={confirmDeleteCurrentLab}
                style={[styles.actionChip, { marginRight: 8, backgroundColor: theme.dangerLight }]}
              >
                <Text style={[styles.actionChipText, { color: theme.danger }]}>
                  🗑️ Delete
                </Text>
              </TouchableOpacity>
              <CustomButton
                title="Cycle Status"
                variant="outline"
                size="sm"
                onPress={() => toggleLabStatus(currentLab.id)}
              />
            </View>
          </View>
        </CustomCard>

        {/* Deliverables / Objectives Section */}
        {currentLab.objectives && currentLab.objectives.length > 0 && (
          <CustomCard style={styles.sectionCard} padding={16}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Activity Deliverables & Criteria
            </Text>
            {currentLab.objectives.map((obj, i) => (
              <View key={i} style={styles.objectiveRow}>
                <Text style={[styles.bullet, { color: theme.primary }]}>✓</Text>
                <Text style={[styles.objectiveText, { color: theme.textSecondary }]}>
                  {obj}
                </Text>
              </View>
            ))}
          </CustomCard>
        )}

        {/* Compilation Status & Rubric Overview */}
        <CustomCard style={styles.sectionCard} padding={16}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Evaluation & Score
          </Text>
          <View
            style={[
              styles.detailStatusBox,
              { backgroundColor: theme.surfaceAlt },
            ]}
          >
            <Text style={[styles.detailStatusTitle, { color: theme.text }]}>
              Current Status: {currentLab.status}
            </Text>
            <Text style={[styles.detailStatusDesc, { color: theme.textSecondary }]}>
              Evaluation Grade: {currentLab.score}
            </Text>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 10,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 36,
  },
  bannerCard: {
    marginBottom: 12,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  numberPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  numberPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bannerIcon: {
    fontSize: 24,
  },
  labTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  labCategory: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  labDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  statusControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000012',
  },
  bannerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusControlLabel: {
    fontSize: 12,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontWeight: '800',
    marginRight: 6,
    fontSize: 13,
  },
  objectiveText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  detailStatusBox: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailStatusDesc: {
    fontSize: 12,
  },
});
