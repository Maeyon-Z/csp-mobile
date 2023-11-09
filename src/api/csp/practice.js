import request from '@/utils/request'

export function genExrcise(data) {
    return request({
        url: '/stu/practice/genExercise',
        method: 'post',
        data: data
    })
}

export function getQues(parentId) {
    return request({
        url: '/stu/exercise/ques/' + parentId,
        method: 'get'
    })
}

export function submitPractice(id) {
    return request({
      url: '/stu/practice/submit/' + id,
      method: 'get'
    })
}