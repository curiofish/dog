import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';

const questions = {
  timeManagement: {
    title: '시간 관리',
    items: [
      {
        question: '하루에 2-3회 산책할 시간이 있나요?',
        info: '강아지는 규칙적인 운동이 필요합니다.'
      },
      {
        question: '정기적인 훈련 시간을 할애할 수 있나요?',
        info: '기본적인 훈련은 반려견의 건강한 성장에 필수적입니다.'
      },
      {
        question: '강아지와 함께할 충분한 시간이 있나요?',
        info: '강아지는 혼자 있는 시간이 길어지면 불안감을 느낄 수 있습니다.'
      }
    ]
  },
  responsibility: {
    title: '책임감',
    items: [
      {
        question: '정기적인 수의사 방문과 예방접종을 할 수 있나요?',
        info: '정기 검진과 예방접종은 반려견의 건강을 위해 필수입니다.'
      },
      {
        question: '응급상황에 대비한 자금을 준비할 수 있나요?',
        info: '예상치 못한 의료비에 대비해야 합니다.'
      },
      {
        question: '강아지의 일상적인 관리(목욕, 털손질 등)를 할 수 있나요?',
        info: '정기적인 관리로 강아지의 건강과 행복을 유지할 수 있습니다.'
      }
    ]
  },
  environment: {
    title: '환경',
    items: [
      {
        question: '강아지를 위한 적절한 공간이 있나요?',
        info: '안전하고 편안한 생활 공간이 필요합니다.'
      },
      {
        question: '강아지가 마음껏 뛰어놀 수 있는 공간이 있나요?',
        info: '운동과 놀이를 위한 공간이 필요합니다.'
      },
      {
        question: '가족 구성원 모두가 강아지 입양에 동의하나요?',
        info: '가족 구성원의 동의와 협조가 중요합니다.'
      }
    ]
  },
  preparation: {
    title: '준비사항',
    items: [
      {
        question: '강아지 용품(사료, 그릇, 침대 등)을 준비할 수 있나요?',
        info: '기본적인 용품들이 필요합니다.'
      },
      {
        question: '강아지 입양 전에 충분한 정보를 수집했나요?',
        info: '품종별 특성과 관리 방법을 알아야 합니다.'
      },
      {
        question: '장기적인 계획(여행, 이사 등)을 고려했나요?',
        info: '강아지와 함께하는 미래 계획을 세워야 합니다.'
      }
    ]
  }
};

export default function App() {
  const [checkedItems, setCheckedItems] = useState({});
  const [score, setScore] = useState(null);
  const [advice, setAdvice] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedHint, setSelectedHint] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const showQuestionHint = (hint) => {
    setSelectedHint(hint);
    setShowHint(true);
  };

  const calculateScore = () => {
    const totalQuestions = Object.values(questions).reduce(
      (acc, section) => acc + section.items.length,
      0
    );
    
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const calculatedScore = Math.round((checkedCount / totalQuestions) * 100);
    setScore(calculatedScore);
    
    const { advice, recommendations } = getAdvice(calculatedScore);
    setAdvice(advice);
    setRecommendations(recommendations);
  };

  const getAdvice = (score) => {
    if (score >= 90) {
      return {
        advice: '🎉 훌륭합니다! 강아지 입양을 위한 준비가 잘 되어있습니다.',
        recommendations: [
          '입양 전에 강아지와 함께할 시간을 더 확보해보세요.',
          '강아지 용품을 미리 준비해보세요.',
          '가까운 동물병원을 미리 찾아보세요.',
          '입양 후의 일상적인 관리 계획을 세워보세요.'
        ],
        details: '당신은 강아지 입양을 위한 대부분의 준비가 되어있습니다. 이제 실제 입양을 고려해볼 수 있는 단계입니다. 입양 전에 마지막으로 필요한 준비사항들을 점검해보세요.'
      };
    } else if (score >= 70) {
      return {
        advice: '👍 대체로 준비가 되어있지만, 몇 가지 사항을 더 고려해보세요.',
        recommendations: [
          '체크하지 못한 항목들을 준비해보세요.',
          '강아지 입양 전에 추가적인 정보를 찾아보세요.',
          '가족 구성원들과 충분한 상의를 해보세요.',
          '입양 후의 일상적인 관리 계획을 세워보세요.'
        ],
        details: '대부분의 준비가 되어있지만, 몇 가지 보완이 필요한 부분이 있습니다. 체크하지 못한 항목들을 하나씩 준비하면서 입양을 위한 준비를 완성해보세요.'
      };
    } else if (score >= 50) {
      return {
        advice: '⚠️ 기본적인 준비가 필요합니다. 체크하지 못한 항목들을 준비해보세요.',
        recommendations: [
          '체크하지 못한 항목들을 하나씩 준비해보세요.',
          '강아지 입양에 대해 더 자세히 알아보세요.',
          '입양 전에 충분한 준비 시간을 가지세요.',
          '가족 구성원들과 함께 준비 계획을 세워보세요.'
        ],
        details: '기본적인 준비가 필요한 상태입니다. 체크하지 못한 항목들을 하나씩 준비하면서, 강아지 입양에 대한 충분한 정보를 수집하고 준비를 진행해보세요.'
      };
    } else {
      return {
        advice: '❌ 아직 강아지 입양을 위한 준비가 더 필요해 보입니다.',
        recommendations: [
          '체크하지 못한 항목들을 모두 준비해보세요.',
          '강아지 입양에 대해 더 자세히 알아보세요.',
          '입양 전에 충분한 준비 시간을 가지세요.',
          '가족 구성원들과 함께 준비 계획을 세워보세요.'
        ],
        details: '아직 많은 준비가 필요한 상태입니다. 강아지 입양은 신중하게 결정해야 하는 중요한 일입니다. 충분한 준비와 계획을 세운 후에 입양을 고려해보세요.'
      };
    }
  };

  const renderQuestionSection = (section, sectionKey) => (
    <View style={styles.section} key={sectionKey}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => {
          const id = `${sectionKey}-${index}`;
          return (
            <View key={id} style={styles.questionContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => handleCheck(id)}
                >
                  <View style={[
                    styles.checkboxInner,
                    checkedItems[id] && styles.checkboxChecked
                  ]}>
                    {checkedItems[id] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <Text style={styles.questionText}>{item.question}</Text>
                <TouchableOpacity 
                  style={styles.hintButton}
                  onPress={() => showQuestionHint(item.info)}
                >
                  <Text style={styles.hintButtonText}>?</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>강아지 입양 준비 체크리스트</Text>
        {Object.entries(questions).map(([key, section]) => 
          renderQuestionSection(section, key)
        )}
        <TouchableOpacity 
          style={styles.button} 
          onPress={calculateScore}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>결과 확인하기</Text>
        </TouchableOpacity>
        {score !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.scoreText}>준비 점수: {score}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${score}%` }]} />
            </View>
            <Text style={styles.adviceText}>{advice}</Text>
            <Text style={styles.detailsText}>{getAdvice(score).details}</Text>
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>추천 사항:</Text>
              {recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showHint}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHint(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHint(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedHint}</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowHint(false)}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    maxWidth: Platform.OS === 'web' ? 800 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionContent: {
    paddingHorizontal: 8,
  },
  questionContainer: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  hintButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  adviceText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#333',
    marginBottom: 16,
  },
  recommendationsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
}); 