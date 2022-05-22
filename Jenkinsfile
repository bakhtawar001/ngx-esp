import org.jenkinsci.plugins.workflow.cps.CpsThread
import org.jenkinsci.plugins.workflow.actions.LabelAction
import com.cwctravel.hudson.plugins.extended_choice_parameter.ExtendedChoiceParameterDefinition

def teamsUrl = 'https://asicentralcom.webhook.office.com/webhookb2/e3c3778f-ddad-4ae3-a2bd-5f703d95b3b4@6504f7e4-d6a1-4688-bf1e-e77e27af6d9a/JenkinsCI/0db0c69b72fb47d0b4961e9b262f6969/f59b800b-0546-4024-bdd8-94898b8bc54f'
def teamsErrorUrl = teamsUrl

def deployToParameter = new ExtendedChoiceParameterDefinition("deployTo", "PT_CHECKBOX",
    "DEV-ESPFamily,UAT-ESPFamily", "", "", "", "", "", "", "", // source of value
    // "DEV-ESPFamily,STAGE-ESPFamily,UAT-ESPFamily,PROD- Files,DR- Files", "", "", "", "", "", "", "", // source of value
    "DEV-ESPFamily", "", "", "", "", "", "", "", // source of default value
    "", "", "", "", "", "", "", "", // source of value description
    false, false, 5, "Environment(s) to deploy to after the release is created. Will automatically enable Create Release mode if you select UAT", ",")

def jiraVersion = "1.0"
def minorVersion = "0"
def jiraProject = "ENCORE"

def projectProperties = [
    disableConcurrentBuilds(abortPrevious: true),
    parameters([
    //     choice(choices: "Release\nDebug\n", description: 'Solution configuration used for build.', name: 'BUILDCONFIGURATION'),
    //     string(defaultValue: '\\\\asi-nas-01\\jenkins\\Releases', description: 'The target location for the distribution package', name: 'BUILDTARGETDIR'),
    //     choice(choices: "Build Only\nPublish Contracts\nPublish Deployment Packages\nCreate Release\n", description: 'Build/deployment options', name: 'buildOptions'),
    //     deployToParameter,
    //     booleanParam(defaultValue: false, description: 'Release JIRA version?', name: 'RELEASEJIRA')
    //     //, string(defaultValue: '', description: 'Base64Encoded result of "username:password"', name: 'JIRA_AUTH')
        booleanParam(defaultValue: false, description: 'Clean up workspace after build', name: 'CLEANUPWORKSPACE'),
        booleanParam(defaultValue: false, description: 'Record Test Execution', name: 'RECORDTEST')
    ]),
    [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '10']]
]

properties(projectProperties)

node {
    def startTime = new Date();

    def branch = env.BRANCH_NAME;
    def buildNumber = env.BUILD_NUMBER
    def workspace = env.WORKSPACE
    def buildUrl = env.BUILD_URL
    def jobName = "${env.JOB_NAME}".tokenize('/')
    def jobOrg = jobName[0]
    def jobRepo = jobName[1]
    def jobBranch = jobName[2]
    def recordTests = params.RECORDTEST || branch == "master"
    def cleanupWorkspace = params.CLEANUPWORKSPACE || branch == "master"

    // PRINT ENVIRONMENT TO JOB
    echo "workspace directory is $workspace"
    echo "build URL is $buildUrl"
    echo "build Number is $buildNumber"
    echo "PATH is $env.PATH"

    try {
        office365ConnectorSend message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER}", status:"Started", webhookUrl: teamsUrl

        stage('Checkout') {
            step([$class: 'GitHubSetCommitStatusBuilder'])

            checkout scm
        }

        stage('NPM Install') {
            withEnv(["NPM_CONFIG_LOGLEVEL=warn"]) {
                bat 'npm ci'
            }
        }

        stage('Test') {
            def testSteps = [:]

            testSteps["Unit Tests"] = {
                withCredentials([string(credentialsId: 'jenkins-jest-github-app-id', variable: 'JEST_APP_ID'), string(credentialsId: 'jenkins-jest-github-key', variable: 'JEST_PRIVATE_KEY')]) {
                    withEnv(['OWNER=asi', 'REPO=ngx-esp']) {
                        bat 'npx nx workspace-lint'
                        bat 'npx nx lint encore --quiet'
                        bat 'npm run test:type-check'

                        if (branch.startsWith('PR-')) {
                            bat 'npx nx affected --base=remotes/origin/master --target=test --parallel --max-parallel=2'
                        } else if (branch == 'master') {
                            bat 'npx nx affected --base=HEAD~1 --target=test --parallel --max-parallel=2'
                        } else {
                            bat 'npx nx run-many --target=test --all --parallel --max-parallel=2'
                        }

                        bat 'npm run report-to-github'
                    }
                }
            };

            testSteps["e2e Tests"] = {
                withCredentials([string(credentialsId: 'jenkins-jest-github-app-id', variable: 'JEST_APP_ID'), string(credentialsId: 'jenkins-jest-github-key', variable: 'JEST_PRIVATE_KEY')]) {
                    def ignoreEmptyResults = false

                    withEnv(['OWNER=asi', 'REPO=ngx-esp']) {
                        bat 'npx nx run encore-e2e:e2e'
                    }
            
                    junit allowEmptyResults: ignoreEmptyResults, healthScaleFactor: 100, testResults: 'reports/apps/encore-e2e/test-*.xml'
                    
                    if (recordTests) {
                        step([$class: 'XrayImportBuilder', endpointName: '/junit', importFilePath: 'reports/apps/encore-e2e/test-*.xml', importToSameExecution: 'true', projectKey: jiraProject, testPlanKey: 'ENCORE-3819', serverInstance: '0ec7c279-cb92-4a2e-93ac-9de8ec6d5eb9'])
                    }
                }
            };

            parallel(testSteps)

            def reports = findFiles(glob: 'reports/**/test-*.xml')

            junit allowEmptyResults: true, healthScaleFactor: 100, testResults: 'reports/**/test-*.xml'

            if (recordTests && reports.length > 0) {
                step([$class: 'XrayImportBuilder', endpointName: '/junit', importFilePath: 'reports/**/test-*.xml', importToSameExecution: 'true', projectKey: jiraProject, serverInstance: '0ec7c279-cb92-4a2e-93ac-9de8ec6d5eb9'])
            }

            dir('reports') {
                deleteDir()
            }
        }
    } catch (error) {
        def message = "Build Failed - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)";
        if (branch == "master") {
            message = "Master Build Failed - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) @dlehman"
            office365ConnectorSend status:"Failure", webhookUrl: teamsErrorUrl, color: 'd9534f'
        }
        //if (branch == "release")
        //    message = "Release Build Failed - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) @dlehman"

        println("Caught Exception: ${error.getMessage()}")

        throw error
    } finally {
        stage('Cleanup') {
            if (cleanupWorkspace) {
                step([$class: 'WsCleanup', notFailBuild: true])
            }
        }
    }
}
