import React, {
  useState,
  useEffect,
  useReducer,
  ReactElement,
  SFC,
} from 'react';
import {
  Switch, Route, Link,
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { MESSAGE_TYPE, MESSAGE_ACTION, AppMessage } from 'client/classes';
import {
  MessageContext,
  messageReducer,
  UserContext,
} from 'client/context';
import {
  MarkOneWrapper,
  Header,
  TabList,
  TabListItem,
  PageBody,
  Logo,
} from 'mark-one';
import { getCurrentUser } from 'client/api';
import { UserResponse } from 'common/dto/users/userResponse.dto';
import styled from 'styled-components';
import { Message } from './layout';
import NoMatch from './pages/NoMatch';
import logo from '../img/seas-logo.svg';

/**
 * The primary app component. Fetches the current user from the server when it
 * mounts, then saves it to the UserContext to pass down to other components
 */

const ColdApp: SFC = (): ReactElement => {
  /**
   * Hook for maintaining the currently selected user
   * */

  const [currentUser, setUser] = useState();

  /**
   * Set up the local reducer for maintaining the current app-wide message
   * queue. The dispatchMessage function will be passed down through the
   * Message Context Provider
   * */

  const [{ currentMessage, queue }, dispatchMessage] = useReducer(
    messageReducer,
    {
      queue: [],
      currentMessage: undefined,
    }
  );

  /**
   * Get the currently authenticated user from the server on launch.
   * If it fails, display a message for the user
   */

  useEffect((): void => {
    getCurrentUser()
      .then(({ data: user }): UserResponse => {
        setUser(user);
        return user;
      })
      .then((user): void => {
        dispatchMessage({
          message: new AppMessage(`Current User: ${user.fullName}`),
          type: MESSAGE_ACTION.PUSH,
        });
      })
      .catch((): void => {
        dispatchMessage({
          message: new AppMessage(
            'Unable to get user data from server. If the problem persists, contact SEAS Computing',
            MESSAGE_TYPE.ERROR
          ),
          type: MESSAGE_ACTION.PUSH,
        });
      });
  }, []);

  const Title = styled.h1`
  font-size: ${({ theme }): string => theme.font.title.size};
  font-family: ${({ theme }): string => theme.font.title.family};
  font-weight: ${({ theme }): string => theme.font.title.weight};
  color: ${({ theme }): string => theme.color.text.medium};
  line-height: 2;
  margin-left: ${({ theme }): string => theme.ws.large};
  `;

  return (
    <div className="app">
      <MarkOneWrapper>
        <UserContext.Provider value={currentUser}>
          <MessageContext.Provider value={dispatchMessage}>
            <div className="app-content">
              <Header justify="left">
                <Logo href="/" image={logo}>SEAS Logo</Logo>
                <Title>Course Planning</Title>
              </Header>
              <nav>
                <TabList>
                  <TabListItem>
                    <Link to="/courses">Courses</Link>
                  </TabListItem>

                  <TabListItem>
                    <Link to="/non-class-meetings">Non class meetings</Link>
                  </TabListItem>

                  <TabListItem>
                    <Link to="/faculty">Faculty</Link>
                  </TabListItem>

                  <TabListItem>
                    <Link to="/schedule">Schedule</Link>
                  </TabListItem>

                  <TabListItem>
                    <Link to="/four-year-plan">4 Year Plan</Link>
                  </TabListItem>
                </TabList>
              </nav>
              <PageBody>
                {currentMessage
              && (
                <Message
                  messageCount={queue.length}
                  messageText={currentMessage.text}
                  messageType={currentMessage.variant}
                />
              )}
                <Switch>
                  <Route component={NoMatch} />
                </Switch>
              </PageBody>
            </div>
          </MessageContext.Provider>
        </UserContext.Provider>
      </MarkOneWrapper>
    </div>
  );
};

export const App = hot(ColdApp);
