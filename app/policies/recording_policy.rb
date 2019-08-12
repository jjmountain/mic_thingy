class RecordingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user: user)
    end
  end

  def new?
    true
  end

  def update?
    record.user == user
  end

  def destroy?
    user_is_owner_or_admin?
  end

  def create?
    true
  end

  def delete?
    user_is_owner_or_admin?
  end

  def show?
    true
  end

  private

  def user_is_owner_or_admin?
    record.user == user || user.admin
  end

end
