/**
 * 강아지 입양 준비도 체크리스트 스크립트
 * @author 이진우 (LEE JINWOO)
 * @contact milgae@naver.com
 * @copyright 2025 All rights reserved.
 * @description 강아지 입양 준비도를 체크하고 맞춤형 조언을 제공하는 인터랙티브 체크리스트
 */

// DOM 요소
const form = document.getElementById('checklist-form');
const calculateBtn = document.getElementById('calculate-btn');
const saveBtn = document.getElementById('save-btn');
const resultDiv = document.getElementById('result');
const finalScoreSpan = document.getElementById('final-score');
const recommendationDiv = document.getElementById('detailed-advice');
const downloadPdfBtn = document.getElementById('download-pdf');
const scrollTopBtn = document.getElementById('scroll-top');

// 상수
const STORAGE_KEY = 'dogAdoptionChecklist';
const TOTAL_QUESTIONS = document.querySelectorAll('.checkbox').length;

// 상태 관리
let savedResponses = {};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadSavedProgress();
    setupEventListeners();
    setupAccessibility();
    setupScrollToTop();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 체크박스 변경 감지
    form.addEventListener('change', handleCheckboxChange);
    
    // 결과 계산
    calculateBtn.addEventListener('click', calculateResults);
    
    // 임시 저장
    saveBtn.addEventListener('click', saveProgress);
    
    // PDF 다운로드
    downloadPdfBtn.addEventListener('click', generatePDF);

    // 설명 토글 버튼
    document.querySelectorAll('.info-button').forEach(button => {
        button.addEventListener('click', toggleExplanation);
    });
}

// 접근성 설정
function setupAccessibility() {
    // 키보드 네비게이션
    document.querySelectorAll('.checkbox, .info-button').forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// 체크박스 변경 처리
function handleCheckboxChange(e) {
    if (e.target.classList.contains('checkbox')) {
        saveBtn.disabled = false;
    }
}

// 결과 계산
function calculateResults() {
    const responses = getResponses();
    const score = calculateScore(responses);
    const advice = generateAdvice(responses);
    
    displayResults(score, advice);
}

// 응답 수집
function getResponses() {
    const responses = {};
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        responses[checkbox.id] = checkbox.checked;
    });
    return responses;
}

// 점수 계산
function calculateScore(responses) {
    const checkedCount = Object.values(responses).filter(Boolean).length;
    return Math.round((checkedCount / TOTAL_QUESTIONS) * 100);
}

// 맞춤형 조언 생성
function generateAdvice(responses) {
    const advice = [];
    const categories = {
        time: { title: '시간 관리', questions: ['time1', 'time2', 'time3', 'time4'] },
        responsibility: { title: '책임감', questions: ['resp1', 'resp2', 'resp3'] },
        financial: { title: '재정적 책임', questions: ['fin1', 'fin2', 'fin3'] },
        environment: { title: '생활 환경', questions: ['env1', 'env2', 'env3'] },
        longTerm: { title: '장기적 계획', questions: ['long1', 'long2', 'long3'] }
    };

    let totalScore = 0;
    let categoryCount = 0;

    for (const [category, data] of Object.entries(categories)) {
        const categoryScore = data.questions.filter(q => responses[q]).length / data.questions.length;
        totalScore += categoryScore;
        categoryCount++;
        
        if (categoryScore < 0.7) {
            advice.push(generateCategoryAdvice(category, categoryScore, false));
        } else {
            advice.push(generateCategoryAdvice(category, categoryScore, true));
        }
    }

    const overallScore = totalScore / categoryCount;
    
    // 전체 점수에 따른 종합 평가 추가
    if (overallScore >= 0.8) {
        advice.unshift({
            title: '입양 준비가 잘 되어있어요! 🎉',
            suggestions: [
                '대부분의 영역에서 충분한 준비가 되어 있습니다.',
                '입양을 진행하셔도 좋을 것 같아요.',
                '입양 전에 마지막으로 가족들과 한 번 더 상의해보세요.'
            ]
        });
    } else if (overallScore >= 0.6) {
        advice.unshift({
            title: '입양 준비가 어느 정도 되어있어요.',
            suggestions: [
                '대체로 준비가 잘 되어 있지만, 일부 보완이 필요합니다.',
                '부족한 부분을 보완한 후 입양을 고려해보세요.',
                '아래 제시된 조언들을 참고해주세요.'
            ]
        });
    }

    return advice;
}

// 카테고리별 조언 생성
function generateCategoryAdvice(category, score, isGood) {
    const adviceMap = {
        time: {
            good: {
                text: '시간 관리가 잘 준비되어 있어요.',
                suggestions: [
                    '계획하신 시간 관리 방식을 잘 지켜주세요.',
                    '강아지의 일과를 규칙적으로 관리하면 좋아요.',
                    '여유 시간을 활용해 강아지와 더 많은 활동을 해보세요.'
                ]
            },
            bad: {
                text: '시간 관리에 대한 준비가 더 필요해요.',
                suggestions: [
                    '강아지와 함께할 수 있는 시간 계획을 구체적으로 세워보세요.',
                    '가족들과 함께 돌봄 시간을 분담하는 방법을 고려해보세요.',
                    '펫시터 서비스나 돌봄 센터를 알아보세요.'
                ]
            }
        },
        responsibility: {
            good: {
                text: '책임감 있는 준비가 잘 되어있어요.',
                suggestions: [
                    '강아지 훈련에 대한 이해가 잘 되어있네요.',
                    '규칙적인 산책과 운동 계획이 잘 세워져 있어요.',
                    '기본적인 케어 방법도 잘 알고 계시네요.'
                ]
            },
            bad: {
                text: '책임감 있는 돌봄에 대한 준비가 더 필요해요.',
                suggestions: [
                    '강아지 훈련에 대해 더 공부해보세요.',
                    '정기적인 산책과 운동 계획을 세워보세요.',
                    '기본적인 강아지 케어 방법을 배워보세요.'
                ]
            }
        },
        financial: {
            good: {
                text: '재정적 준비가 잘 되어있어요.',
                suggestions: [
                    '예상 지출 계획이 잘 세워져 있네요.',
                    '응급 상황을 위한 준비도 잘 되어있어요.',
                    '반려동물 보험 가입도 고려해보세요.'
                ]
            },
            bad: {
                text: '재정적 준비가 더 필요해요.',
                suggestions: [
                    '월별 예상 지출을 구체적으로 계산해보세요.',
                    '반려동물 보험에 대해 알아보세요.',
                    '응급 상황을 위한 저축 계획을 세워보세요.'
                ]
            }
        },
        environment: {
            good: {
                text: '생활 환경이 잘 준비되어 있어요.',
                suggestions: [
                    '강아지를 위한 공간이 잘 확보되어 있네요.',
                    '이웃과의 관계도 잘 고려하고 계시네요.',
                    '안전한 환경 구성이 잘 되어있어요.'
                ]
            },
            bad: {
                text: '생활 환경 개선이 필요해요.',
                suggestions: [
                    '강아지가 활동할 수 있는 공간을 확보해보세요.',
                    '이웃과의 관계를 고려한 소음 관리 방안을 생각해보세요.',
                    '강아지 안전을 위한 환경 개선을 계획해보세요.'
                ]
            }
        },
        longTerm: {
            good: {
                text: '장기적인 계획이 잘 세워져 있어요.',
                suggestions: [
                    '향후 변화에 대한 고려가 잘 되어있네요.',
                    '가족들과의 협력 방안도 잘 준비되어 있어요.',
                    '반려동물 동반 가능한 환경도 잘 고려하고 계시네요.'
                ]
            },
            bad: {
                text: '장기적인 계획이 더 필요해요.',
                suggestions: [
                    '향후 10-15년간의 생활 변화를 고려해보세요.',
                    '반려동물 동반 가능한 주거 환경을 찾아보세요.',
                    '가족 전체의 동의와 협력 방안을 논의해보세요.'
                ]
            }
        }
    };

    return {
        title: adviceMap[category][isGood ? 'good' : 'bad'].text,
        suggestions: adviceMap[category][isGood ? 'good' : 'bad'].suggestions
    };
}

// 결과 표시
function displayResults(score, advice) {
    resultDiv.classList.remove('hidden');
    finalScoreSpan.textContent = `${score}%`;
    
    // 점수 애니메이션
    document.querySelector('.score-circle').style.setProperty('--progress', `${score}%`);
    
    // 조언 표시
    let adviceHTML = '<div class="advice-container">';
    advice.forEach(item => {
        adviceHTML += `
            <div class="advice-item">
                <h4>${item.title}</h4>
                <ul>
                    ${item.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    adviceHTML += '</div>';
    
    recommendationDiv.innerHTML = adviceHTML;
}

// 진행 상황 저장
function saveProgress() {
    const responses = getResponses();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    saveBtn.disabled = true;
    
    // 저장 확인 메시지
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = '진행 상황이 저장되었습니다.';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 저장된 진행 상황 불러오기
function loadSavedProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        savedResponses = JSON.parse(saved);
        
        // 저장된 응답 복원
        Object.entries(savedResponses).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = checked;
            }
        });
    }
}

// PDF 생성
async function generatePDF() {
    try {
        // PDF 생성 시작 알림
        showToast('PDF 생성 중입니다...', 'info');

        // 현재 체크된 항목들의 정보를 수집
        const responses = getResponses();
        const score = calculateScore(responses);
        const advice = generateAdvice(responses);
        
        // 날짜 포맷팅
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

        // PDF 내용 생성을 위한 임시 요소
        const tempDiv = document.createElement('div');
        tempDiv.style.padding = '20px';
        tempDiv.style.maxWidth = '800px';
        tempDiv.style.margin = '0 auto';
        tempDiv.style.fontFamily = 'Noto Sans KR, sans-serif';

        tempDiv.innerHTML = `
            <h1 style="color: #4CAF50; text-align: center; margin-bottom: 30px; font-size: 24px;">강아지 입양 준비도 체크리스트 결과</h1>
            <p style="text-align: right; color: #666;">${formattedDate}</p>
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                <h2 style="color: #2196F3; font-size: 20px;">준비도 점수: ${score}%</h2>
            </div>
            <div style="margin-top: 20px;">
                ${advice.map(item => `
                    <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #4CAF50; background: #f8f9fa;">
                        <h3 style="color: #4CAF50; margin-bottom: 10px; font-size: 18px;">${item.title}</h3>
                        <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                            ${item.suggestions.map(suggestion => 
                                `<li style="margin-bottom: 8px; padding-left: 20px; position: relative; font-size: 14px;">• ${suggestion}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 2px solid #eee;">
                <p style="color: #666; font-size: 12px; margin-bottom: 5px;">© 2025 강아지 입양 준비도 체크리스트</p>
                <p style="color: #666; font-size: 12px;">제작: 이진우 (LEE JINWOO) | 문의: milgae@naver.com</p>
                <p style="color: #4CAF50; font-size: 12px; margin-top: 10px;">책임감 있는 반려동물 입양을 응원합니다</p>
            </div>
        `;

        // PDF 생성 옵션
        const opt = {
            margin: [10, 10],
            filename: `강아지_입양_준비도_결과_${formatDate(today)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };

        // PDF 생성
        await html2pdf().from(tempDiv).set(opt).save();
        showToast('PDF가 성공적으로 저장되었습니다!', 'success');

    } catch (error) {
        console.error('PDF 생성 중 오류 발생:', error);
        showToast('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
}

// 날짜 포맷팅 헬퍼 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 토스트 메시지 표시 함수
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 설명 토글
function toggleExplanation(e) {
    const explanation = e.target.nextElementSibling;
    const isHidden = explanation.classList.contains('hidden');
    
    explanation.classList.toggle('hidden');
    e.target.setAttribute('aria-expanded', isHidden);
}

// 맨 위로 스크롤 기능 설정
function setupScrollToTop() {
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // 클릭 이벤트 리스너
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
