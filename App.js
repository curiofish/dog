import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Checkbox, Card, ProgressBar } from 'react-native-paper';

const questions = {
  timeManagement: [
    {
      id: 'time1',
      text: '하루에 2-3시간 이상 강아지와 함께 시간을 보낼 수 있나요?',
      info: '강아지는 많은 관심과 시간이 필요합니다. 산책, 놀이, 훈련 등에 충분한 시간을 할애할 수 있어야 합니다.'
    },
    {
      id: 'time2',
      text: '주말에도 강아지와 산책하고 놀아줄 시간이 있나요?',
      info: '주말에도 강아지는 운동과 관심이 필요합니다.'
    }
  ],
  responsibility: [
    {
      id: 'resp1',
      text: '매일 아침저녁으로 강아지 밥을 챙겨줄 수 있나요?',
      info: '규칙적인 식사 시간은 강아지의 건강에 매우 중요합니다.'
    },
    {
      id: 'resp2',
      text: '하루에 2-3번 강아지를 산책시킬 수 있나요?',
      info: '정기적인 산책은 강아지의 신체적, 정신적 건강에 필수적입니다.'
    }
  ]
};

const getAdvice = (score) => {
  if (score >= 90) {
    return {
      title: '훌륭한 준비 상태입니다! 👏',
      description: '강아지 입양을 위한 준비가 잘 되어있네요. 다음 단계로 넘어갈 준비가 되었습니다.',
      recommendations: [
        '입양하고 싶은 강아지의 품종에 대해 더 자세히 알아보세요.',
        '주변의 신뢰할 수 있는 보호소나 브리더를 찾아보세요.',
        '필요한 물품들의 목록을 작성해보세요.'
      ]
    };
  } else if (score >= 70) {
    return {
      title: '좋은 준비 상태입니다! 🌟',
      description: '대체로 준비가 잘 되어있지만, 몇 가지 더 고려해볼 사항이 있습니다.',
      recommendations: [
        '체크하지 못한 항목들을 다시 한 번 검토해보세요.',
        '가족들과 함께 준비 사항을 상의해보세요.',
        '시간 관리와 책임감에 대해 더 구체적인 계획을 세워보세요.'
      ]
    };
  } else if (score >= 50) {
    return {
      title: '조금 더 준비가 필요합니다 🤔',
      description: '강아지 입양을 위해 더 많은 준비가 필요해 보입니다.',
      recommendations: [
        '체크하지 못한 항목들에 대한 해결 방안을 찾아보세요.',
        '강아지 돌봄에 대해 더 많이 공부해보세요.',
        '현실적인 시간 관리 계획을 세워보세요.'
      ]
    };
  } else {
    return {
      title: '아직 준비가 더 필요합니다 💭',
      description: '강아지 입양은 큰 책임이 따르는 결정입니다. 천천히 준비해보세요.',
      recommendations: [
        '강아지 돌봄에 대한 기본적인 지식을 쌓아보세요.',
        '생활 패턴을 강아지와 함께 살기에 적합하게 조정해보세요.',
        '다른 강아지를 키우는 가정의 경험담을 들어보세요.'
      ]
    };
  }
};

export default function App() {
  const [checkedItems, setCheckedItems] = useState({});
  const [score, setScore] = useState(null);
  const [advice, setAdvice] = useState(null);

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateScore = () => {
    const totalQuestions = Object.values(questions).reduce((acc, curr) => acc + curr.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const percentage = Math.round((checkedCount / totalQuestions) * 100);
    setScore(percentage);
    setAdvice(getAdvice(percentage));
  };

  const renderQuestionSection = (title, questionList) => (
    <Card style={styles.section}>
      <Card.Content>
        <Text style={styles.sectionTitle}>{title}</Text>
        {questionList.map(question => (
          <View key={question.id} style={styles.questionContainer}>
            <View style={styles.questionRow}>
              <Checkbox
                status={checkedItems[question.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheck(question.id)}
                color="#4A90E2"
              />
              <Text style={styles.questionText}>{question.text}</Text>
            </View>
            <Text style={styles.infoText}>{question.info}</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>강아지 입양 준비 정도 체크리스트</Text>
          <Text style={styles.subtitle}>책임감 있는 반려동물 입양을 위한 첫걸음</Text>
        </View>

        {renderQuestionSection('시간 관리', questions.timeManagement)}
        {renderQuestionSection('책임감', questions.responsibility)}
        
        <TouchableOpacity style={styles.button} onPress={calculateScore}>
          <Text style={styles.buttonText}>결과 확인하기</Text>
        </TouchableOpacity>

        {score !== null && (
          <Card style={styles.resultContainer}>
            <Card.Content>
              <Text style={styles.resultTitle}>당신의 준비 정도</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{score}%</Text>
                <ProgressBar
                  progress={score / 100}
                  color="#4A90E2"
                  style={styles.progressBar}
                />
              </View>
              
              {advice && (
                <View style={styles.adviceContainer}>
                  <Text style={styles.adviceTitle}>{advice.title}</Text>
                  <Text style={styles.adviceDescription}>{advice.description}</Text>
                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>추천 사항:</Text>
                    {advice.recommendations.map((recommendation, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationBullet}>•</Text>
                        <Text style={styles.recommendationText}>{recommendation}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    margin: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4A90E2',
  },
  questionContainer: {
    marginBottom: 15,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  infoText: {
    marginLeft: 40,
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    margin: 10,
    elevation: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    width: '100%',
    borderRadius: 5,
  },
  adviceContainer: {
    marginTop: 20,
  },
  adviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  adviceDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  recommendationsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A90E2',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
}); 